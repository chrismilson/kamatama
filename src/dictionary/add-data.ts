import { IDBPDatabase } from 'idb'
import path from 'path'
import { toHiragana } from 'wanakana'
import { JMEntry } from '../types/JMEntry'
import { KanjiCharacter } from '../types/Kanji'
import jsonIterator from './json-iterator'

export const addKanjiToDB = async (db: IDBPDatabase) => {
  for await (const kanjiGroup of jsonIterator<KanjiCharacter>(
    path.join(process.env.PUBLIC_URL, 'dict/kanjidic2.json.gz')
  )) {
    const tx = db.transaction('allKanji', 'readwrite')

    await Promise.all(kanjiGroup.map((kanji) => tx.store.put(kanji)))

    await tx.done
  }
}

export const addPhrasesToDB = async (db: IDBPDatabase) => {
  for await (const phraseGroup of jsonIterator<JMEntry>(
    path.join(process.env.PUBLIC_URL, 'dict/JMdict.json.gz')
  )) {
    const tx = db.transaction(['allPhrases', 'queryStore'], 'readwrite')

    await Promise.all([
      phraseGroup.map((phrase) => {
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
