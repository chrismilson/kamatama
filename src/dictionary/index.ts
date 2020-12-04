import { openDB } from 'idb'

const initDB = async () => {
  const db = await openDB('kamatama', 1, {
    upgrade: async (db, _, version) => {
      console.log(`Upgrading database to version ${version}.`)

      const allKanji = db.createObjectStore('allKanji', { keyPath: 'literal' })

      const allPhrases = db.createObjectStore('allPhrases', {
        keyPath: 'sequenceNumber'
      })

      const queryStore = db.createObjectStore('queryStore', {
        keyPath: 'sequenceNumber'
      })

      queryStore.createIndex('exact', 'exact', { multiEntry: true })
      queryStore.createIndex('partial', 'partial', { multiEntry: true })

      await Promise.all(
        [allKanji, allPhrases, queryStore].map(
          ({ transaction }) => transaction.done
        )
      ).catch(console.error)

      console.log(`Database upgraded to version ${version}`)
    }
  })

  return db
}

export default initDB
