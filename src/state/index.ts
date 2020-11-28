import { IDBPDatabase } from 'idb'
import { makeAutoObservable, runInAction } from 'mobx'
import initDB from '../dictionary'
import { JMEntry } from '../types/JMEntry'

/**
 * Represents a store of the app's state.
 */
export class KamatamaJishoStore {
  /** The current search query. */
  query: string
  loadingResults: boolean
  results: JMEntry[]
  request: number
  dbPromise: Promise<IDBPDatabase>

  constructor() {
    makeAutoObservable(this)

    this.query = ''
    this.loadingResults = false
    this.results = []
    this.request = 0
    this.dbPromise = initDB()
  }

  setQuery(updateFactory: string | ((priorQuery: string) => string)) {
    if (updateFactory instanceof Function) {
      this.query = updateFactory(this.query)
    } else {
      this.query = updateFactory
    }
    this.fetchResults()
  }

  private async fetchResults() {
    if (this.query === '') return

    const requestID = ++this.request

    const sequenceNumbers = await this.fetchSequenceNumbersForProperty(
      'phraseReadings'
    )

    const db = await this.dbPromise
    const tx = db.transaction('allPhrases')

    const results: JMEntry[] = []

    await Promise.all(
      Array.from(sequenceNumbers).map(async (number) => {
        const entry = await tx.store.get(number)

        results.push(entry)
      })
    )

    if (requestID === this.request)
      runInAction(() => {
        this.results = results
      })
  }

  private async fetchSequenceNumbersForProperty(property: string) {
    const db = await this.dbPromise

    const tx = db.transaction(property)
    const allSequenceNumbers = new Set<number>()

    await tx.store
      .index(property)
      .getAll(IDBKeyRange.bound(this.query, this.query + '\uffff'), 50)
      .then((results) => {
        results.forEach((reading) => {
          allSequenceNumbers.add(reading.sequenceNumber)
        })
      })

    await tx.done

    return allSequenceNumbers
  }
}

const store = new KamatamaJishoStore()
export default store
