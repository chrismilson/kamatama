import { IDBPDatabase } from 'idb'
import { JMEntry } from '../types/JapaneseMulti'
import { KanjiCharacter } from '../types/Kanji'
import jsonIterator from './json-iterator'
import path from 'path'

export const addKanjiToDB = async (db: IDBPDatabase) => {
  for await (const kanjiGroup of jsonIterator<KanjiCharacter>(
    path.join(process.env.PUBLIC_URL, 'dict/kanjidic2.json')
  )) {
    const tx = db.transaction('allKanji', 'readwrite')

    await Promise.all(kanjiGroup.map((kanji) => tx.store.put(kanji)))

    await tx.done
  }
}

export const addPhrasesToDB = async (db: IDBPDatabase) => {
  for await (const phraseGroup of jsonIterator<JMEntry>(
    path.join(process.env.PUBLIC_URL, 'dict/jmdict.json')
  )) {
    const tx = db.transaction(['allPhrases', 'phraseReadings'], 'readwrite')

    await Promise.all([
      phraseGroup.map((phrase) => {
        return Promise.all([
          tx.objectStore('allPhrases').put(phrase),
          tx.objectStore('phraseReadings').put({
            sequenceNumber: phrase.sequenceNumber,
            reading: phrase.reading.map((reading) => reading.value)
          })
        ])
      })
    ])

    await tx.done
  }
}

export const addAllDataToDB = async (db: IDBPDatabase) => {
  return Promise.all([addKanjiToDB(db), addPhrasesToDB(db)])
}

export default addAllDataToDB
