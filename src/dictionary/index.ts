import { openDB } from 'idb'
import addAllDataToDB from './add-data'

const initDB = async () => {
  return openDB('kamatama', 1, {
    upgrade: async (db, _, version) => {
      console.log(`Upgrading database to version ${version}.`)

      const allKanji = db.createObjectStore('allKanji', { keyPath: 'literal' })

      const allPhrases = db.createObjectStore('allPhrases', {
        keyPath: 'sequenceNumber'
      })

      const queryStore = db.createObjectStore('queryStore', {
        keyPath: 'sequenceNumber'
      })

      queryStore.createIndex('queryStore', 'values', {
        multiEntry: true
      })

      await Promise.all(
        [allKanji, allPhrases, queryStore].map(
          ({ transaction }) => transaction.done
        )
      ).catch(console.error)

      await addAllDataToDB(db)

      console.log(`Database upgraded to version ${version}`)
    }
  })
}

export default initDB
