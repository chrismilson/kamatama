import { openDB } from 'idb'

const initDB = async () => {
  return openDB('kamatama', 1, {
    upgrade: async (db, _, version) => {
      console.log(`Upgrading database to version ${version}.`)

      const allKanji = db.createObjectStore('allKanji', { keyPath: 'literal' })

      const allPhrases = db.createObjectStore('allPhrases', {
        keyPath: 'sequenceNumber'
      })

      const phraseReadings = db.createObjectStore('phraseReadings', {
        keyPath: 'sequenceNumber'
      })

      phraseReadings.createIndex('phraseReadings', 'reading', {
        multiEntry: true
      })

      await Promise.all(
        [allKanji, allPhrases, phraseReadings].map(
          ({ transaction }) => transaction.done
        )
      ).catch(console.error)

      console.log(`Database upgraded to version ${version}`)
    }
  })
}

export default initDB
