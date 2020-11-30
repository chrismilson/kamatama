import { IDBPDatabase } from 'idb'
import { JMEntry } from '../types/JMEntry'
import { KanjiCharacter } from '../types/Kanji'
import jsonIterator from './json-iterator'
import path from 'path'

/**
 * Calculates a url for github's media service.
 *
 * The url will have the form:
 *
 * > https://media.githubusercontent.com/media/_Username_/_Project_/_Branch_/_Path_to_file_
 */
const getMediaUrl = (filePath: string) => {
  const baseUrl = 'https://media.githubusercontent.com/media/'
  const userName = 'chrismilson'
  const project = 'kamatama'
  const branch = 'master'

  return baseUrl + path.join(userName, project, branch, filePath)
}

export const addKanjiToDB = async (db: IDBPDatabase) => {
  for await (const kanjiGroup of jsonIterator<KanjiCharacter>(
    process.env.NODE_ENV === 'development'
      ? path.join(process.env.PUBLIC_URL, 'dict/kanjidic2.json')
      : getMediaUrl('dictionary/json/kanjidic2.json')
  )) {
    const tx = db.transaction('allKanji', 'readwrite')

    await Promise.all(kanjiGroup.map((kanji) => tx.store.put(kanji)))

    await tx.done
  }
}

export const addPhrasesToDB = async (db: IDBPDatabase) => {
  for await (const phraseGroup of jsonIterator<JMEntry>(
    process.env.NODE_ENV === 'development'
      ? path.join(process.env.PUBLIC_URL, 'dict/JMdict.json')
      : getMediaUrl('dictionary/json/JMdict.json')
  )) {
    const tx = db.transaction(['allPhrases', 'queryStore'], 'readwrite')

    await Promise.all([
      phraseGroup.map((phrase) => {
        return Promise.all([
          tx.objectStore('allPhrases').put(phrase),
          tx.objectStore('queryStore').put({
            sequenceNumber: phrase.sequenceNumber,
            values: phrase.reading
              .map((reading) => reading.value)
              .concat(phrase.kanji.map((kanji) => kanji.value))
          })
        ])
      })
    ])

    await tx.done
  }
}

export const addDataIfNeeded = async (db: IDBPDatabase) => {
  const promises = []

  if ((await db.count('allKanji')) < 13108) {
    promises.push(addKanjiToDB(db))
  }
  if ((await db.count('allPhrases')) < 190269) {
    promises.push(addPhrasesToDB(db))
  }

  await Promise.all(promises)
}
