import { openDB } from 'idb'

const initDB = async () => {
  const db = await openDB('kamatama', 1, {
    upgrade: async (db, _, version) => {
      console.log(`Upgrading database to version ${version}.`)

      const allKanji = db.createObjectStore('allKanji', { keyPath: 'literal' })

      // Since the radical is already in a form that we can index by, there is
      // no point adding it to the db twice.
      allKanji.createIndex('radical', 'radical', { multiEntry: true })

      const kanjiQueryStore = db.createObjectStore('kanjiQueryStore', {
        keyPath: 'literal'
      })

      kanjiQueryStore.createIndex('reading', 'reading', { multiEntry: true })

      const allPhrases = db.createObjectStore('allPhrases', {
        keyPath: 'sequenceNumber'
      })

      const phraseQueryStore = db.createObjectStore('phraseQueryStore', {
        keyPath: 'sequenceNumber'
      })

      phraseQueryStore.createIndex('exact', 'exact', { multiEntry: true })
      phraseQueryStore.createIndex('partial', 'partial', { multiEntry: true })

      await Promise.all(
        [allKanji, allPhrases, phraseQueryStore, kanjiQueryStore].map(
          ({ transaction }) => transaction.done
        )
      ).catch(console.error)

      console.log(`Database upgraded to version ${version}`)
    }
  })

  return db
}

export default initDB
