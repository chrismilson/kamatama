/**
 * States the code of the character in the various character set standards.
 */
export interface KanjiCodepoint {
  /**
   * States the coding standard applying to the element. The values assigned so
   * far are:
   *
   * - `jis208` - JIS X 0208-1997 - kuten coding (nn-nn)
   * - `jis212` - JIS X 0212-1990 - kuten coding (nn-nn)
   * - `jis213` - JIS X 0213-2000 - kuten coding (p-nn-nn)
   * - `ucs` - Unicode 4.0 - hex coding (4 or 5 hexadecimal digits)
   */
  type: 'jis208' | 'jis212' | 'jis213' | 'ucs'
  /**
   * Contains the codepoint of the character in a particular standard. The
   * standard will be identified in the type property.
   */
  value: string
}

export interface KanjiRadical {
  /**
   * States the type of radical classification.
   *
   * - `classical` - based on the system first used in the KangXi Zidian. The
   *   Shibano "JIS Kanwa Jiten" is used as the reference source.
   * - `nelson_c` - as used in the Nelson "Modern Japanese-English Character
   *   Dictionary" (i.e. the Classic, not the New Nelson). This will only be
   *   used where Nelson reclassified the kanji.
   */
  type: string
  /**
   * The radical number, in the range 1 to 214. The particular classification
   * type is stated in the type property.
   */
  value: string
}

/**
 * Either a cross-reference code to another kanji, usually regarded as a
 * variant, or an alternative indexing code for the current kanji.
 */
export interface KanjiVariant {
  /**
   * Indicates the type of variant code. The current values are:
   *
   * - `jis208` \* - in JIS X 0208 - kuten coding
   * - `jis212` \* - in JIS X 0212 - kuten coding
   * - `jis213` \* - in JIS X 0213 - kuten coding
   * - `deroo` - De Roo number - numeric
   * - `njecd` - Halpern NJECD index number - numeric
   * - `s_h` - The Kanji Dictionary (Spahn & Hadamitzky) - descriptor
   * - `nelson_c` - "Classic" Nelson - numeric
   * - `oneill` - Japanese Names (O'Neill) - numeric
   * - `ucs` - Unicode codepoint- hex
   *
   * \* Mostly relate to "shinjitai/kyuujitai" alternative character glyphs
   */
  type:
    | 'jis208'
    | 'jis212'
    | 'jis213'
    | 'deroo'
    | 'njecd'
    | 's_h'
    | 'nelson_c'
    | 'oneill'
    | 'ucs'
  value: string
}

/**
 * Contains an index number. The particular dictionary, etc. is defined by the
 * type property.
 */
export interface KanjiDictionaryReference {
  /**
   * Defines the dictionary or reference book, etc. to which the reference
   * applies. The initial allocation is:
   *
   * - `nelson_c` - "Modern Reader's Japanese-English Character Dictionary",
   *   edited by Andrew Nelson (now published as the "Classic" Nelson).
   * - `nelson_n` - "The New Nelson Japanese-English Character Dictionary",
   *   edited by John Haig.
   * - `halpern_njecd` - "New Japanese-English Character Dictionary", edited by
   *   Jack Halpern.
   * - `halpern_kkd` - "Kodansha Kanji Dictionary", (2nd Ed. of the NJECD)
   *   edited by Jack Halpern.
   * - `halpern_kkld` - "Kanji Learners Dictionary" (Kodansha) edited by Jack
   *   Halpern.
   * - `halpern_kkld_2ed` - "Kanji Learners Dictionary" (Kodansha), 2nd edition
   *   (2013) edited by Jack Halpern.
   * - `heisig` - "Remembering The  Kanji"  by  James Heisig.
   * - `heisig6` - "Remembering The  Kanji, Sixth Ed."  by  James Heisig.
   * - `gakken` - "A  New Dictionary of Kanji Usage" (Gakken)
   * - `oneill_names` - "Japanese Names", by P.G. O'Neill.
   * - `oneill_kk` - "Essential Kanji" by P.G. O'Neill.
   * - `moro` - "Daikanwajiten" compiled by Morohashi. For some kanji two
   *   additional properties are used: m_vol:  the volume of the dictionary in
   *   which the kanji is found, and m_page: the page number in the volume.
   * - `henshall` - "A Guide To Remembering Japanese Characters" by Kenneth G.
   *   Henshall.
   * - `sh_kk` - "Kanji and Kana" by Spahn and Hadamitzky.
   * - `sh_kk2` - "Kanji and Kana" by Spahn and Hadamitzky (2011 edition).
   * - `sakade` - "A Guide To Reading and Writing Japanese" edited by Florence
   *   Sakade.
   * - `jf_cards` - Japanese Kanji Flashcards, by Max Hodges and Tomoko Okazaki.
   *   (Series 1)
   * - `henshall3` - "A Guide To Reading and Writing Japanese" 3rd edition,
   *   edited by Henshall, Seeley and De Groot.
   * - `tutt_cards` - Tuttle Kanji Cards, compiled by Alexander Kask.
   * - `crowley` - "The Kanji Way to Japanese Language Power" by Dale Crowley.
   * - `kanji_in_context` - "Kanji in Context" by Nishiguchi and Kono.
   * - `busy_people` - "Japanese For Busy People" vols I-III, published by the
   *   AJLT. The codes are the volume.chapter.
   * - `kodansha_compact` - the "Kodansha Compact Kanji Guide".
   * - `maniette` - codes from Yves Maniette's "Les Kanjis dans la tete" French
   *   adaptation of Heisig.
   */
  type:
    | 'nelson_c'
    | 'nelson_n'
    | 'halpern_njecd'
    | 'halpern_kkd'
    | 'halpern_kkld'
    | 'halpern_kkld_2ed'
    | 'heisig'
    | 'heisig6'
    | 'gakken'
    | 'oneill_names'
    | 'oneill_kk'
    | 'moro'
    | 'henshall'
    | 'sh_kk'
    | 'sh_kk2'
    | 'sakade'
    | 'jf_cards'
    | 'henshall3'
    | 'tutt_cards'
    | 'crowley'
    | 'kanji_in_context'
    | 'busy_people'
    | 'kodansha_compact'
    | 'maniette'
  value: string
  /**
   * The volume of the dictionary in which the kanji is found. See the `moro`
   * type.
   */
  mVol?: number
  /** The page number in the volume. See the `moro` type. */
  mPage?: number
}

/**
 * Query codes contain information relating to the glyph, and can be used for
 * finding a required kanji.
 */
export interface KanjiQueryCode {
  /**
   * Defines the type of query code. The current values are:
   * - `skip` - Halpern's SKIP (System  of  Kanji  Indexing  by  Patterns) code.
   *   The  format is n-nn-nn.  See the KANJIDIC  documentation for  a
   *   description of the code and restrictions on  the commercial  use  of this
   *   data. There are also a number of misclassification codes, indicated by
   *   the "skip_misclass" property.
   * - `sh_desc` - the descriptor codes for The Kanji Dictionary (Tuttle 1996)
   *   by Spahn and Hadamitzky. They are in the form nxnn.n, e.g. 3k11.2, where
   *   the  kanji has 3 strokes in the identifying radical, it is radical "k" in
   *   the SH classification system, there are 11 other strokes, and it is the
   *   2nd kanji in the 3k11 sequence. (I am very grateful to Mark Spahn for
   *   providing the list of these descriptor codes for the kanji in this file.)
   * - `four_corner` - the "Four Corner" code for the kanji. This is a code
   *   invented by Wang Chen in 1928. See the KANJIDIC documentation for  an
   *   overview of  the Four Corner System.
   * - `deroo` - the codes developed by the late Father Joseph De Roo, and
   *   published in  his book "2001 Kanji" (Bonjinsha). Fr De Roo gave his
   *   permission for these codes to be included.
   * - `misclass` - a possible misclassification of the kanji according to one
   *   of the code types.
   */
  type: 'skip' | 'sh_desc' | 'four_corner' | 'deroo' | 'misclass'
  /**
   * The values of this property indicate the type if misclassification:
   *
   * - `posn` - a mistake in the division of the kanji
   * - `stroke_count` - a mistake in the number of strokes
   * - `stroke_and_posn` - mistakes in both division and strokes
   * - `stroke_diff` - ambiguous stroke counts depending on glyph
   */
  skipMisclass?: string
  value: string
}

export interface KanjiReading {
  /**
   * Defines the type of reading. The current values are:
   *
   * - `pinyin` - the modern PinYin romanization of the Chinese reading of the
   *   kanji. The tones are represented by a concluding digit.
   * - `korean_r` - the romanized form of the Korean reading(s) of the kanji.
   *   The readings are in the (Republic of Korea) Ministry of Education style
   *   of romanization.
   * - `korean_h` - the Korean reading(s) of the kanji in hangul.
   * - `vietnam` - the Vietnamese readings supplied by Minh Chau Pham.
   * - `ja_on` - the "on" Japanese reading of the kanji, in katakana. Another
   *   property `r_status`, if present, will indicate with a value of "jy"
   *   whether the reading is approved for a "Jouyou kanji". A further property
   *   `on_type`, if present,  will indicate with a value of kan, go, tou or
   *   kan'you the type of on-reading.
   * - `ja_kun` - the "kun" Japanese reading of the kanji, usually in hiragana.
   *   Where relevant the okurigana is also included separated by a ".".
   *   Readings associated with prefixes and suffixes are marked with a "-". A
   *   second property `rStatus`, if present, will indicate with a value of
   *   "jy" whether the reading is approved for a "Jouyou kanji".
   */
  type: 'pinyin' | 'korean_r' | 'korean_h' | 'vietnam' | 'ja_on' | 'ja_kun'
  value: string
  onType?: string
  rStatus?: string
}

export interface KanjiReadingMeaning {
  /**
   * Defines the target language of the meaning. It will be coded using the
   * two-letter language code from the ISO 639-1 standard. When absent, the
   * value "en" (i.e. English) is implied.
   */
  language?: string
  value: string
}

/**
 * The readings for the kanji in several languages, and the meanings, also in
 * several languages. The readings and meanings are grouped to enable the
 * handling of the situation where the meaning is differentiated by reading.
 */
export interface KanjiReadingMeaningGroup {
  reading: KanjiReading[]
  meaninig: KanjiReadingMeaning[]
}

/**
 * Japanese readings that are now only associated with names.
 */
export interface KanjiNanoriReading {
  value: string
}

export interface KanjiCharacter {
  /** The character itself in UTF8 coding. */
  literal: string
  codepoint: KanjiCodepoint[]
  radical: KanjiRadical[]
  misc: {
    /**
     * The kanji grade level.
     *
     * - 1 through 6 indicates a Kyouiku kanji and the grade in which the kanji
     *   is taught in Japanese schools.
     * - 8 indicates it is one of the remaining Jouyou Kanji to be learned in
     *   junior high school.
     * - 9 indicates it is a Jinmeiyou (for use in names) kanji which in
     *   addition to the Jouyou kanji are approved for use in family name
     *   registers and other official documents.
     * - 10 also indicates a Jinmeiyou kanji which is a variant of a Jouyou
     *   kanji.
     */
    grade?: number
    /**
     * The stroke count of the kanji, including the radical.
     *
     * If more than one, the first is considered the accepted count, while
     * subsequent ones are common miscounts.
     */
    strokeCount: number[]
    variant?: KanjiVariant[]
    /**
     * A frequency-of-use ranking. The 2,500 most-used characters have a
     * ranking; those characters that lack this field are not ranked.
     *
     * The frequency is a number from 1 to 2,500 that expresses the relative
     * frequency of occurrence of a character in modern Japanese. This is based
     * on a survey in newspapers, so it is biassed towards kanji used in
     * newspaper articles. The discrimination between the less frequently used
     * kanji is not strong. (Actually there are 2,501 kanji ranked as there was
     * a tie.)
     */
    freq?: number
    /**
     * When the kanji is itself a radical and has a name, this contains the
     * name(s) (in hiragana.)
     */
    radicalName?: string[]
    /**
     * The (former) Japanese Language Proficiency test level for this kanji.
     *
     * Values range from 1 (most advanced) to 4 (most elementary).
     *
     * This property does not appear on kanji that were not required for any
     * JLPT level. Note that the JLPT test levels changed in 2010, with a new
     * 5-level system (N1 to N5) being introduced. No official kanji lists are
     * available for the new levels. The new levels are regarded as being
     * similar to the old levels except that the old level 2 is now divided
     * between N2 and N3.
     */
    jlpt?: number
  }
  dictionaryNumber: KanjiDictionaryReference[]
  queryCode: KanjiQueryCode[]
  readingMeaning: (KanjiReadingMeaningGroup | KanjiNanoriReading)[]
}
