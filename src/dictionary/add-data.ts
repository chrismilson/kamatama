import { IDBPDatabase } from 'idb'
import path from 'path'
import { toHiragana } from 'wanakana'
import { JMEntry } from '../types/JMEntry'
import { KanjiCharacter } from '../types/Kanji'
import jsonIterator from './json-iterator'

export const totalKanji = 13108
export const totalPhrases = 190269

/**
 * Adds data from a url to an IndexedDB.
 *
 * @param url A url to a gzipped json file containing entries of type T.
 * @param db The IndexedDB to add the data to.
 * @param dataHandler An array of store names and functions that will transform
 * an entry into data to put into said store. If the handler returns undefined,
 * the entry will not be added to the store.
 *
 * A lone string will just place the entries as-is into the store of that name.
 * @param handleProgress An optional method that will be called periodically,
 * reporting on the progress made in adding the data to the database. It will be
 * called with the number of processed entries.
 */
export async function addDataToDB<T>(
  url: string,
  db: IDBPDatabase,
  dataHandler: (
    | string
    | {
        storeName: string
        entryHandler: (entry: T) => any
      }
  )[],
  handleProgress?: (progress: number) => void
) {
  let count = 0

  const storeNames: string[] = []
  const handlers: ((entry: T) => any)[] = []
  const identityHandler = (entry: T) => entry

  for (const nameOrHandler of dataHandler) {
    if (typeof nameOrHandler === 'string') {
      storeNames.push(nameOrHandler)
      handlers.push(identityHandler)
    } else {
      storeNames.push(nameOrHandler.storeName)
      handlers.push(nameOrHandler.entryHandler)
    }
  }

  for await (const group of jsonIterator<T>(
    path.join(process.env.PUBLIC_URL, url)
  )) {
    const tx = db.transaction(storeNames, 'readwrite')

    await Promise.all(
      group.map((data) =>
        Promise.all(
          handlers
            .map((h) => h(data))
            .filter((entry) => entry !== undefined)
            .map((entry, i) => tx.objectStore(storeNames[i]).put(entry))
        )
      )
    )
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
  return addDataToDB<KanjiCharacter>(
    'dict/kanjidic2.json.gz',
    db,
    [
      'allKanji',
      {
        storeName: 'kanjiQueryStore',
        entryHandler: ({ literal, readingMeaning }) => {
          const readings = readingMeaning?.flatMap((meaningGroupOrNanori) => {
            if ('value' in meaningGroupOrNanori) {
              return [meaningGroupOrNanori.value]
            } else {
              return meaningGroupOrNanori.reading
                .filter(({ type }) => type === 'ja_kun' || type === 'ja_on')
                .map(({ value }) => toHiragana(value))
            }
          })
          if (readings && readings.length > 0) {
            return { literal, readings }
          }
        }
      }
    ],
    handleProgress
  )
}

export const addPhrasesToDB = async (
  db: IDBPDatabase,
  handleProgress?: (progress: number) => void
) => {
  return addDataToDB<JMEntry>(
    'dict/JMdict.json.gz',
    db,
    [
      'allPhrases',
      {
        storeName: 'phraseQueryStore',
        entryHandler: (phrase) => {
          const queryJP: {
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

            queryJP.exact.push(hiragana)
            for (let i = 1; i < hiragana.length; i++) {
              queryJP.partial.push(hiragana.substring(i))
            }
          }

          return queryJP
        }
      }
    ],
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
  if (
    process.env.NODE_ENV !== 'development' &&
    (await db.count('allPhrases')) < totalPhrases
  ) {
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
