/**
 * The overwhelming majority of entries will have a single kanji element
 * associated with a word in Japanese. Where there are multiple kanji elements
 * within an entry, they will be orthographical variants of the same word,
 * either using variations in okurigana, or alternative and equivalent kanji.
 *
 * Common "mis-spellings" may be included, provided they are associated with
 * appropriate information fields. Synonyms are not included; they may be
 * indicated in the cross-reference field associated with the sense element.
 */
export interface JMKanjiElement {
  /**
   * Contains a word or short phrase in Japanese which is written using at least
   * one non-kana character (usually kanji, but can be other characters).
   *
   * The valid characters are kanji, kana, related characters such as chouon and
   * kurikaeshi, and in exceptional cases, letters from other alphabets.
   */
  value: string
  /**
   * This is a coded information field related specifically to the orthography
   * of the kanji, and will typically indicate some unusual aspect, such as
   * okurigana irregularity.
   */
  information: (
    | 'ateji' // ateji (phonetic) reading
    | 'ik' // word containing irregular kana usage
    | 'iK' // word containing irregular kanji usage
    | 'io' // irregular okurigana usage
    | 'oK' // word containning out-dated kanji
  )[]
  /**
   * This and the equivalent property for readings are provided to record
   * information about the relative priority of the entry. It consists of codes
   * indicating how the word appears in various references, which can be taken
   * as an indication of the frequency with which the word is used. 
   *
   * This field is intended for use either by applications which want to
   * concentrate on entries of a particular priority, or to generate subset
   * files.
   *
   * The current values in this field are:
   *
   * - news1/2: appears in the "wordfreq" file compiled by Alexandre Girardi
   *   from the Mainichi Shimbun. (See the Monash ftp archive for a copy.) Words
   *   in the first 12,000 in that file are marked "news1" and words in the
   *   second 12,000 are marked "news2".
   * - ichi1/2: appears in the "Ichimango goi bunruishuu", Senmon Kyouiku
   *   Publishing, Tokyo, 1998.  (The entries marked "ichi2" were demoted from
   *   ichi1 because they were observed to have low frequencies in the WWW and
   *   newspapers.)
   * - spec1 and spec2: a small number of words use this marker when they are
   *   detected as being common, but are not included in other lists.
   * - gai1/2: common loanwords, based on the wordfreq file.
   * - nfxx: this is an indicator of frequency-of-use ranking in the wordfreq
   *   file. "xx" is the number of the set of 500 words in which the entry can
   *   be found, with "01" assigned to the first 500, "02" to the second, and so
   *   on. (The entries with news1, ichi1, spec1, spec2 and gai1 values are
   *   marked with a "(P)" in the EDICT and EDICT2 files.)

   * The reason both the kanji and reading elements are tagged is because on
   * occasions a priority is only associated with a particular kanji/reading
   * pair.
   */
  priority: string[]
}

/**
 * Typically contains the valid readings of the word(s) in the kanji element
 * using modern kanadzukai.
 *
 * Where there are multiple reading elements, they will typically be alternative
 * readings of the kanji element. In the absence of a kanji element, i.e. in the
 * case of a word or phrase written entirely in kana, these elements will define
 * the entry.
 */
export interface JMReadingElement {
  /**
   * Restricted to kana and related characters such as chouon and kurikaeshi.
   *
   * Kana usage will be consistent between the kanji and reading elements; e.g.
   * if the kanji contains katakana, so too will the reading.
   */
  value: string
  /**
   * Indicates that the reading, while associated with the kanji, cannot be
   * regarded as a true reading of the kanji. It is typically used for words
   * such as foreign place names, or gairaigo which can be in kanji or katakana.
   */
  noKanji: boolean
  /**
   * Indicates when the reading only applies to a subset of the kanji elements
   * in the entry. When empty, all readings apply to all kanji elements. The
   * contents of this must exactly match those of one of the kanji elements.
   */
  restriction: string[]
  /**
   * General coded information pertaining to the specific reading.
   *
   * Typically it will be used to indicate some unusual aspect of the reading.
   */
  information: (
    | 'gikun' // gikun (meaning as reading) or jukujikun (special kanji reading)
    | 'ik' // word containing irregular kana usage
    | 'ok' // out-dated or obsolete kana usage
    | 'uK' // word usually written using kanji alone
  )[]
  /**
   * This and the equivalent property for kanji are provided to record
   * information about the relative priority of the entry. It consists of codes
   * indicating how the word appears in various references, which can be taken
   * as an indication of the frequency with which the word is used.
   *
   * This field is intended for use either by applications which want to
   * concentrate on entries of a particular priority, or to generate subset
   * files.
   *
   * The current values in this field are:
   *
   * - news1/2: appears in the "wordfreq" file compiled by Alexandre Girardi
   *   from the Mainichi Shimbun. (See the Monash ftp archive for a copy.) Words
   *   in the first 12,000 in that file are marked "news1" and words in the
   *   second 12,000 are marked "news2".
   * - ichi1/2: appears in the "Ichimango goi bunruishuu", Senmon Kyouiku
   *   Publishing, Tokyo, 1998.  (The entries marked "ichi2" were demoted from
   *   ichi1 because they were observed to have low frequencies in the WWW and
   *   newspapers.)
   * - spec1 and spec2: a small number of words use this marker when they are
   *   detected as being common, but are not included in other lists.
   * - gai1/2: common loanwords, based on the wordfreq file.
   * - nfxx: this is an indicator of frequency-of-use ranking in the wordfreq
   *   file. "xx" is the number of the set of 500 words in which the entry can
   *   be found, with "01" assigned to the first 500, "02" to the second, and so
   *   on. (The entries with news1, ichi1, spec1, spec2 and gai1 values are
   *   marked with a "(P)" in the EDICT and EDICT2 files.)
   *
   * The reason both the kanji and reading elements are tagged is because on
   * occasions a priority is only associated with a particular kanji/reading
   * pair.
   */
  priority: string[]
}

/**
 * Records the information about the source language(s) of a loan-word/gairaigo.
 * If the source language is other than English, the language is indicated by
 * the xml:lang attribute.
 */
export interface JMSenseSourceLanguage {
  /**
   * Defines the language(s) from which a loanword is drawn.  It will be coded
   * using the three-letter language code from the ISO 639-2 standard.
   */
  language: string
  /**
   * The source word or phrase.
   */
  value?: string
  /**
   * Indicates whether the source word or phrase fully or partially describes
   * the source of the loanword.
   */
  type: 'full' | 'part'
  /**
   * Indicates that the Japanese word has been constructed from words in the
   * source language, and not from an actual phrase in that language. Most
   * commonly used to indicate "waseieigo".
   */
  wasei: boolean
}

/**
 * Describes target-language words or phrases which are equivalent to the
 * Japanese word.
 */
export interface JMSenseGlossary {
  /**
   * Defines the target language of the glossary. It will be coded using the
   * three-letter language code from the ISO 639 standard.
   */
  language?: string
  gender?: string
  /**
   * Specifies that the glossary is of a particular type.
   */
  type:
    | 'lit' // literal
    | 'fig' // figurative
    | 'expl' // explanation
  value: string
}

/**
 * Records the translational equivalent of the Japanese word, plus other related
 * information.
 */
export interface JMSense {
  /**
   * Represents that the sense is restricted to the lexeme represented by the
   * kanji.
   */
  kanji: string[]
  /**
   * Represents that the sense is restricted to the lexeme represented by the
   * reading.
   */
  reading: string[]
  /**
   * Indicates a cross-reference to another entry with a similar or related
   * meaning or sense.
   *
   * The content of a reference is typically a kanji or reading element in
   * another entry. In some cases a kanji will be followed by a reading and/or a
   * sense number to provide a precise target for the cross-reference. Where
   * this happens, a JIS "centre-dot" (0x2126) is placed between the components
   * of the cross-reference. The target kanji or reading must not contain a
   * centre-dot.
   */
  reference: string[]
  /**
   * Indicates another entry which is an antonym of the current sense. The
   * content of this element must exactly match that of a kanji or reading
   * element in another entry.
   */
  antonym: string[]
  partOfSpeech: (
    | 'adj-f' // noun or verb acting prenominally
    | 'adj-i' // adjective (keiyoushi)
    | 'adj-ix' // adjective (keiyoushi) - yoi/ii class
    | 'adj-kari' // 'kari' adjective (archaic)
    | 'adj-ku' // 'ku' adjective (archaic)
    | 'adj-na' // adjectival nouns or quasi-adjectives (keiyodoshi)
    | 'adj-nari' // archaic/formal form of na-adjective
    | 'adj-no' // nouns which may take the genitive case particle 'no'
    | 'adj-pn' // pre-noun adjectival (rentaishi)
    | 'adj-shiku' // 'shiku' adjective (archaic)
    | 'adj-t' // 'taru' adjective
    | 'adv' // adverb (fukushi)
    | 'adv-to' // adverb taking the 'to' particle
    | 'aux' // auxiliary
    | 'aux-adj' // auxiliary adjective
    | 'aux-v' // auxiliary verb
    | 'conj' // conjunction
    | 'cop' // copula
    | 'ctr' // counter
    | 'exp' // expressions (phrases, clauses, etc.)
    | 'int' // interjection (kandoushi)
    | 'n' // noun (common) (futsuumeishi)
    | 'n-adv' // adverbial noun (fukushitekimeishi)
    | 'n-pr' // proper noun
    | 'n-pref' // noun, used as a prefix
    | 'n-suf' // noun, used as a suffix
    | 'n-t' // noun (temporal) (jisoumeishi)
    | 'num' // numeric
    | 'pn' // pronoun
    | 'pref' // prefix
    | 'prt' // particle
    | 'suf' // suffix
    | 'unc' // unclassified
    | 'v-unspec' // verb unspecified
    | 'v1' // Ichidan verb
    | 'v1-s' // Ichidan verb - kureru special class
    | 'v2a-s' // Nidan verb with 'u' ending (archaic)
    | 'v2b-k' // Nidan verb (upper class) with 'bu' ending (archaic)
    | 'v2b-s' // Nidan verb (lower class) with 'bu' ending (archaic)
    | 'v2d-k' // Nidan verb (upper class) with 'dzu' ending (archaic)
    | 'v2d-s' // Nidan verb (lower class) with 'dzu' ending (archaic)
    | 'v2g-k' // Nidan verb (upper class) with 'gu' ending (archaic)
    | 'v2g-s' // Nidan verb (lower class) with 'gu' ending (archaic)
    | 'v2h-k' // Nidan verb (upper class) with 'hu/fu' ending (archaic)
    | 'v2h-s' // Nidan verb (lower class) with 'hu/fu' ending (archaic)
    | 'v2k-k' // Nidan verb (upper class) with 'ku' ending (archaic)
    | 'v2k-s' // Nidan verb (lower class) with 'ku' ending (archaic)
    | 'v2m-k' // Nidan verb (upper class) with 'mu' ending (archaic)
    | 'v2m-s' // Nidan verb (lower class) with 'mu' ending (archaic)
    | 'v2n-s' // Nidan verb (lower class) with 'nu' ending (archaic)
    | 'v2r-k' // Nidan verb (upper class) with 'ru' ending (archaic)
    | 'v2r-s' // Nidan verb (lower class) with 'ru' ending (archaic)
    | 'v2s-s' // Nidan verb (lower class) with 'su' ending (archaic)
    | 'v2t-k' // Nidan verb (upper class) with 'tsu' ending (archaic)
    | 'v2t-s' // Nidan verb (lower class) with 'tsu' ending (archaic)
    | 'v2w-s' // Nidan verb (lower class) with 'u' ending and 'we' conjugation (archaic)
    | 'v2y-k' // Nidan verb (upper class) with 'yu' ending (archaic)
    | 'v2y-s' // Nidan verb (lower class) with 'yu' ending (archaic)
    | 'v2z-s' // Nidan verb (lower class) with 'zu' ending (archaic)
    | 'v4b' // Yodan verb with 'bu' ending (archaic)
    | 'v4g' // Yodan verb with 'gu' ending (archaic)
    | 'v4h' // Yodan verb with 'hu/fu' ending (archaic)
    | 'v4k' // Yodan verb with 'ku' ending (archaic)
    | 'v4m' // Yodan verb with 'mu' ending (archaic)
    | 'v4n' // Yodan verb with 'nu' ending (archaic)
    | 'v4r' // Yodan verb with 'ru' ending (archaic)
    | 'v4s' // Yodan verb with 'su' ending (archaic)
    | 'v4t' // Yodan verb with 'tsu' ending (archaic)
    | 'v5aru' // Godan verb - -aru special class
    | 'v5b' // Godan verb with 'bu' ending
    | 'v5g' // Godan verb with 'gu' ending
    | 'v5k' // Godan verb with 'ku' ending
    | 'v5k-s' // Godan verb - Iku/Yuku special class
    | 'v5m' // Godan verb with 'mu' ending
    | 'v5n' // Godan verb with 'nu' ending
    | 'v5r' // Godan verb with 'ru' ending
    | 'v5r-i' // Godan verb with 'ru' ending (irregular verb)
    | 'v5s' // Godan verb with 'su' ending
    | 'v5t' // Godan verb with 'tsu' ending
    | 'v5u' // Godan verb with 'u' ending
    | 'v5u-s' // Godan verb with 'u' ending (special class)
    | 'v5uru' // Godan verb - Uru old class verb (old form of Eru)
    | 'vi' // intransitive verb
    | 'vk' // Kuru verb - special class
    | 'vn' // irregular nu verb
    | 'vr' // irregular ru verb, plain form ends with -ri
    | 'vs' // noun or participle which takes the aux. verb suru
    | 'vs-c' // su verb - precursor to the modern suru
    | 'vs-i' // suru verb - included
    | 'vs-s' // suru verb - special class
    | 'vt' // transitive verb
    | 'vz' // Ichidan verb - zuru verb (alternative form of -jiru verbs)
  )[]
  /**
   * Contains information about the field of application of the entry/sense.
   */
  field: (
    | 'agric' // agriculture
    | 'anat' // anatomy
    | 'archeol' // archeology
    | 'archit' // architecture, building
    | 'art' // art, aesthetics
    | 'astron' // astronomy
    | 'audvid' // audio-visual
    | 'aviat' // aviation
    | 'baseb' // baseball
    | 'biochem' // biochemistry
    | 'biol' // biology
    | 'bot' // botany
    | 'Buddh' // Buddhism
    | 'bus' // business
    | 'chem' // chemistry
    | 'Christn' // Christianity
    | 'comp' // computing
    | 'cryst' // crystallography
    | 'ecol' // ecology
    | 'econ' // economics
    | 'elec' // electricity, elec. eng.
    | 'electr' // electronics
    | 'embryo' // embryology
    | 'engr' // engineering
    | 'ent' // entomology
    | 'finc' // finance
    | 'fish' // fishing
    | 'food' // food, cooking
    | 'gardn' // gardening, horticulture
    | 'genet' // genetics
    | 'geogr' // geography
    | 'geol' // geology
    | 'geom' // geometry
    | 'go' // go (game)
    | 'golf' // golf
    | 'gramm' // grammar
    | 'grmyth' // Greek mythology
    | 'hanaf' // hanafuda
    | 'horse' // horse-racing
    | 'law' // law
    | 'ling' // linguistics
    | 'logic' // logic
    | 'MA' // martial arts
    | 'mahj' // mahjong
    | 'math' // mathematics
    | 'mech' // mechanical engineering
    | 'med' // medicine
    | 'met' // climate, weather
    | 'mil' // military
    | 'music' // music
    | 'ornith' // ornithology
    | 'paleo' // paleontology
    | 'pathol' // pathology
    | 'pharm' // pharmacy
    | 'phil' // philosophy
    | 'photo' // photography
    | 'physics' // physics
    | 'physiol' // physiology
    | 'print' // printing
    | 'psych' // psychology, psychiatry
    | 'Shinto' // Shinto
    | 'shogi' // shogi
    | 'sports' // sports
    | 'stat' // statistics
    | 'sumo' // sumo
    | 'telec' // telecommunications
    | 'tradem' // trademark
    | 'vidg' // video game
    | 'zool' // zoology
  )[]
  /**
   * Used for other relevant information about the entry/sense.
   *
   * As with parts of speech, information will usually apply to several senses.
   */
  misc: (
    | 'abbr' //abbreviation
    | 'arch' //archaism
    | 'char' //character
    | 'chn' //children's language
    | 'col' //colloquialism
    | 'company' //company name
    | 'creat' //creature
    | 'dated' //dated term
    | 'dei' //deity
    | 'derog' //derogatory
    | 'ev' //event
    | 'fam' //familiar language
    | 'fem' //female term or language
    | 'fict' //fiction
    | 'given' //given name or forename, gender not specified
    | 'hist' //historical term
    | 'hon' //honorific or respectful (sonkeigo) language
    | 'hum' //humble (kenjougo) language
    | 'id' //idiomatic expression
    | 'joc' //jocular, humorous term
    | 'leg' //legend
    | 'litf' //literary or formal term
    | 'm-sl' //manga slang
    | 'male' //male term or language
    | 'myth' //mythology
    | 'net-sl' //Internet slang
    | 'obj' //object
    | 'obs' //obsolete term
    | 'obsc' //obscure term
    | 'on-mim' //onomatopoeic or mimetic word
    | 'organization' //organization name
    | 'oth' //other
    | 'person' //full name of a particular person
    | 'place' //place name
    | 'poet' //poetical term
    | 'pol' //polite (teineigo) language
    | 'product' //product name
    | 'proverb' //proverb
    | 'quote' //quotation
    | 'rare' //rare
    | 'relig' //religion
    | 'sens' //sensitive
    | 'serv' //service
    | 'sl' //slang
    | 'station' //railway station
    | 'surname' //family or surname
    | 'uk' //word usually written using kana alone
    | 'unclass' //unclassified name
    | 'vulg' //vulgar expression or word
    | 'work' //work of art, literature, music, etc. name
    | 'X' //rude or X-rated term (not displayed in educational software)
    | 'yoji' //yojijukugo
  )[]
  sourceLanguage: JMSenseSourceLanguage[]
  /**
   * For words specifically associated with regional dialects in Japanese.
   */
  dialect: (
    | 'hob' // Hokkaido-ben
    | 'ksb' // Kansai-ben
    | 'ktb' // Kantou-ben
    | 'kyb' // Kyoto-ben
    | 'kyu' // Kyuushuu-ben
    | 'nab' // Nagano-ben
    | 'osb' // Osaka-ben
    | 'rkb' // Ryuukyuu-ben
    | 'thb' // Touhoku-ben
    | 'tsb' // Tosa-ben
    | 'tsug' // Tsugaru-ben
  )[]
  glossary: JMSenseGlossary[]
  /**
   * Provides for additional information to be recorded about a sense.
   *
   * Typical usage would be to indicate such things as level of currency of a
   * sense, the regional variations, etc.
   */
  information: string
}

/**
 * Consists of kanji elements, reading elements, general information and sense
 * elements.
 *
 * Each entry will have at least one reading element and one sense element.
 * Others are optional.
 */
export interface JMEntry {
  /**
   * A unique numeric sequence number for each entry.
   */
  sequenceNumber: number
  kanji: JMKanjiElement[]
  reading: JMReadingElement[]
  sense: JMSense[]
}
