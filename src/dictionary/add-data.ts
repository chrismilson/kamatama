import { IDBPDatabase, IDBPTransaction } from 'idb'
import path from 'path'
import { toHiragana } from 'wanakana'
import { JMEntry } from '../types/JMEntry'
import { KanjiCharacter } from '../types/Kanji'
import jsonIterator from './json-iterator'

export const totalKanji = 13108
export const totalPhrases = 190269

export async function addDataToDB<T>(
  url: string,
  db: IDBPDatabase,
  storeNames: string[],
  handleData: (
    tx: IDBPTransaction<unknown, string[]>,
    data: T
  ) => Promise<void>,
  handleProgress?: (progress: number) => void
) {
  let count = 0

  for await (const group of jsonIterator<T>(
    path.join(process.env.PUBLIC_URL, url)
  )) {
    const tx = db.transaction(storeNames, 'readwrite')

    await Promise.all(group.map((data) => handleData(tx, data)))
    await tx.done

    count += group.length
    if (handleProgress !== undefined) {
      handleProgress(count)
    }
  }
}

export const addKanjiToDB = async (
  db: IDBPDatabase,
  handleProgress?: (progress: number) => void
) => {
  await addDataToDB<KanjiCharacter>(
    'dict/kanjidic2.json.gz',
    db,
    ['allKanji'],
    (tx, kanji) => tx.objectStore('allKanji').put(kanji).then(),
    handleProgress
  )
}

export const addPhrasesToDB = async (
  db: IDBPDatabase,
  handleProgress?: (progress: number) => void
) => {
  await addDataToDB<JMEntry>(
    'dict/JMdict.json.gz',
    db,
    ['allPhrases', 'queryStore'],
    async (tx, phrase) => {
      const query: {
        sequenceNumber: number
        exact: string[]
        kana: string[]
        partial: string[]
      } = {
        sequenceNumber: phrase.sequenceNumber,
        exact: [],
        kana: [],
        partial: []
      }

      for (const { value } of [...phrase.kanji, ...phrase.reading]) {
        const hiragana = toHiragana(value)

        query.exact.push(hiragana)
        for (let i = 1; i < hiragana.length; i++) {
          query.partial.push(hiragana.substring(i))
        }
      }

      return Promise.all([
        tx.objectStore('allPhrases').put(phrase),
        tx.objectStore('queryStore').put(query)
      ]).then()
    },
    handleProgress
  )
}

export const addDataIfNeeded = async (
  db: IDBPDatabase,
  handleProgress?: (progress: number) => void
) => {
  const promises = []
  let kanjiProgress = 0
  let phraseProgress = 0

  if ((await db.count('allKanji')) < totalKanji) {
    promises.push(
      addKanjiToDB(db, (progress) => {
        kanjiProgress = progress

        if (handleProgress) {
          handleProgress(kanjiProgress + phraseProgress)
        }
      })
    )
  } else {
    kanjiProgress = totalKanji
  }
  if ((await db.count('allPhrases')) < totalPhrases) {
    promises.push(
      addPhrasesToDB(db, (progress) => {
        phraseProgress = progress

        if (handleProgress) {
          handleProgress(kanjiProgress + phraseProgress)
        }
      })
    )
  } else {
    phraseProgress = totalPhrases
  }

  await Promise.all(promises)
}
