import xml.etree.ElementTree as ET
import json
from itertools import islice
import re
import os
from collections import defaultdict


class NoEntities:
    """
    Creates a clone of the target xml file such that the <!ENTITY x "y"> tags
    become <!ENTITY x "x">.
    """

    def __init__(self, xmlFile):
        self.targetName = xmlFile
        self.tmpName = 'temp.xml'

    def __enter__(self):
        match = r'<!ENTITY\s+(\S+)\s+"[^"]+"\s*>'
        replace = r'<!ENTITY \1 "\1">'

        with open(self.targetName) as target:
            with open(self.tmpName, 'w') as tmp:
                tmp.writelines(
                    re.sub(match, replace, line)
                    for line in target
                )

        return self.tmpName

    def __exit__(self, *exec_info):
        os.remove(self.tmpName)


def jmdicToJSON(targetPath, *, minify=True):
    with NoEntities('./raw/JMdict.xml') as xml:
        tree = ET.parse(xml)
        root = tree.getroot()

        def processEntry(entry):
            result = {}

            # Sequence number
            result['sequenceNumber'] = int(entry.find('ent_seq').text)

            # Kanji element
            result['kanji'] = []
            for kanjiElement in entry.findall('k_ele'):
                kanjiElementResult = {}

                kanjiElementResult['value'] = kanjiElement.find('keb').text

                kanjiElementResult['information'] = []
                for info in kanjiElement.findall('ke_inf'):
                    kanjiElementResult['information'].append(info.text)

                kanjiElementResult['priority'] = []
                for priority in kanjiElement.findall('ke_pri'):
                    kanjiElementResult['priority'].append(priority.text)

                result['kanji'].append(kanjiElementResult)

            result['reading'] = []
            for readingElement in entry.findall('r_ele'):
                readingElementResult = {}

                readingElementResult['value'] = readingElement.find('reb').text

                readingElementResult['noKanji'] = readingElement.find(
                    're_nokanji'
                ) != None

                readingElementResult['restriction'] = []
                for restriction in readingElement.findall('re_restr'):
                    readingElementResult['restriction'].append(
                        restriction.text
                    )

                readingElementResult['information'] = []
                for info in readingElement.findall('re_inf'):
                    readingElementResult['information'].append(info.text)

                readingElementResult['priority'] = []
                for priority in readingElement.findall('re_pri'):
                    readingElementResult['priority'].append(priority.text)

                result['reading'].append(readingElementResult)

            result['sense'] = []
            for sense in entry.findall('sense'):
                senseResult = {}

                senseResult['kanji'] = []
                for kanji in sense.findall('stagk'):
                    senseResult['kanji'].append(kanji.text)

                senseResult['reading'] = []
                for reading in sense.findall('stagr'):
                    senseResult['reading'].append(reading.text)

                senseResult['reference'] = []
                for reference in sense.findall('xref'):
                    senseResult['reference'].append(reference.text)

                senseResult['antonym'] = []
                for antonym in sense.findall('ant'):
                    senseResult['antonym'].append(antonym.text)

                senseResult['partOfSpeech'] = []
                for partOfSpeech in sense.findall('pos'):
                    senseResult['partOfSpeech'].append(partOfSpeech.text)

                senseResult['field'] = []
                for field in sense.findall('field'):
                    senseResult['field'].append(field.text)

                senseResult['misc'] = []
                for misc in sense.findall('misc'):
                    senseResult['misc'].append(misc.text)

                senseResult['sourceLanguage'] = []
                for sourceLanguage in sense.findall('lsource'):
                    sourceLanguageResult = {}

                    sourceLanguageResult['language'] = sourceLanguage.get(
                        'xml:lang'
                    )

                    if (value := sourceLanguage.text):
                        sourceLanguageResult['value'] = value

                    if sourceLanguage.get('sl_type') != None:
                        sourceLanguageResult['type'] = 'part'
                    else:
                        sourceLanguageResult['type'] = 'full'

                    senseResult['sourceLanguage'].append(sourceLanguageResult)

                senseResult['glossary'] = []
                for gloss in sense.findall('gloss'):
                    glossResult = {}

                    if gloss.get('xml:lang') != None:
                        # We are only interested in English
                        continue

                    if (gender := gloss.get('g_gend')) != None:
                        glossResult['gender'] = gender

                    glossResult['value'] = gloss.text

                    senseResult['glossary'].append(glossResult)

                senseResult['information'] = []
                for info in sense.findall('s_inf'):
                    senseResult['information'].append(info.text)

                senseResult['dialect'] = []
                for dialect in sense.findall('dial'):
                    senseResult['dialect'].append(dialect.text)

                result['sense'].append(senseResult)

            return result

        entries = [
            processEntry(entry)
            for entry in root.findall('entry')
            # for entry in islice(root.findall('entry'), 5000)
            # for entry in [root.find('entry')]
        ]

    with open(targetPath, 'w') as jsonFile:
        jsonFile.write(json.dumps(
            entries,
            indent=None if minify else 2
        ))


def kanjidic2ToJSON(targetPath, *, minify=True):
    tree = ET.parse('./raw/kanjidic2.xml')
    root = tree.getroot()

    def processCharacter(character):
        result = {}

        # Literal
        result['literal'] = character.find('literal').text

        # Codepoint
        result['codepoint'] = []
        for cpValue in character.find('codepoint'):
            result['codepoint'].append({
                'type': cpValue.get('cp_type'),
                'value': cpValue.text
            })

        # Radical
        result['radical'] = []
        for radValue in character.find('radical'):
            result['radical'].append({
                'type': radValue.get('rad_type'),
                'value': radValue.text
            })

        # Misc
        result['misc'] = {}
        misc = character.find('misc')

        if (grade := misc.find('grade')) != None:
            result['misc']['grade'] = int(grade.text)

        result['misc']['strokeCount'] = []
        for count in misc.findall('stroke_count'):
            result['misc']['strokeCount'].append(int(count.text))

        if (variants := misc.findall('variant')):
            result['misc']['variant'] = []

            for variant in variants:
                result['misc']['variant'].append({
                    'type': variant.get('var_type'),
                    'value': variant.text
                })

        if (freq := misc.find('freq')) != None:
            result['misc']['freq'] = int(freq.text)

        if (radicalNames := misc.findall('rad_name')):
            result['misc']['radicalName'] = []
            for radicalName in radicalNames:
                result['misc']['radicalName'].append(radicalName.text)

        if (jlpt := misc.find('jlpt')) != None:
            result['misc']['jlpt'] = int(jlpt.text)

        # Dictionary number
        if (dicRefs := character.find('dic_number')) != None:
            result['dictionaryNumber'] = []
            for dicRef in dicRefs:
                result['dictionaryNumber'].append({
                    'type': dicRef.get('dr_type'),
                    'value': dicRef.text
                })
                if (mVol := dicRef.get('m_vol')) != None:
                    result['dictionaryNumber'][-1]['mVol'] = int(mVol)
                if (mPage := dicRef.get('m_page')) != None:
                    result['dictionaryNumber'][-1]['mPage'] = int(mPage)

        # Query code
        if (queryCodes := character.find('query_code')) != None:
            result['queryCode'] = []

            for queryCode in queryCodes:
                result['queryCode'].append({
                    'type': queryCode.get('qc_type'),
                    'value': queryCode.text
                })

                if (skipMisclass := queryCode.get('skip_misclass')) != None:
                    result['queryCode'][-1]['skipMisclass'] = skipMisclass

        # Reading meaning
        if (readingMeanings := character.find('reading_meaning')) != None:
            result['readingMeaning'] = []

            for rmGroup in readingMeanings.findall('rmgroup'):
                rmGroupResult = {
                    'reading': [],
                    'meaning': []
                }

                for reading in rmGroup.findall('reading'):
                    rmGroupResult['reading'].append({
                        'type': reading.get('r_type'),
                        'value': reading.text
                    })

                    if (onType := reading.get('on_type')) != None:
                        rmGroupResult['reading'][-1]['onType'] = onType
                    if (rStatus := reading.get('rStatus')) != None:
                        rmGroupResult['reading'][-1]['rStatus'] = rStatus

                for meaning in rmGroup.findall('meaning'):
                    rmGroupResult['meaning'].append({
                        'value': meaning.text
                    })

                    if (language := meaning.get('m_lang')) != None:
                        rmGroupResult['meaning'][-1]['language'] = language

                result['readingMeaning'].append(rmGroupResult)

            for nanori in readingMeanings.findall('nanori'):
                result['readingMeaning'].append({
                    'value': nanori.text
                })

        return result

    chars = [
        processCharacter(character)
        for character in root.findall('character')
    ]

    with open(targetPath, 'w') as jsonFile:
        jsonFile.write(json.dumps(
            chars,
            indent=None if minify else 2
        ))


if __name__ == "__main__":
    kanjiDicPath = '../public/dict/kanjidic2.json'
    jmdictPath = '../public/dict/JMdict.json'

    if not os.path.isfile(kanjiDicPath):
        kanjidic2ToJSON(kanjiDicPath)

    if not os.path.isfile(jmdictPath):
        jmdicToJSON(jmdictPath)
