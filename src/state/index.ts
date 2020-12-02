import { IDBPDatabase } from 'idb'
import { makeAutoObservable, runInAction } from 'mobx'
import { toHiragana } from 'wanakana'
import initDB from '../dictionary'
import { JMEntry } from '../types/JMEntry'

/**
 * Represents a store of the app's state.
 */
export class KamatamaJishoStore {
  /** The current search query. */
  query: string
  loadingResults: boolean
  /**
   * A counter to increment on result fetching.
   *
   * If the results come back and the counter has been increased, we should
   * abandon the results.
   */
  request: number
  results: JMEntry[]
  dbPromise: Promise<IDBPDatabase>

  /**
   * A counter to increment on entry fetching.
   *
   * If the entry comes back and the counter has been increased, we should
   * abandon the result.
   */
  entry: number
  /**
   * The currently selected entry.
   */
  currentEntry?: JMEntry

  constructor() {
    makeAutoObservable(this)

    this.query = ''
    this.loadingResults = false
    this.results = []
    this.request = 0
    this.entry = 0
    this.dbPromise = initDB()
  }

  setQuery(updateFactory: string | ((priorQuery: string) => string)) {
    if (updateFactory instanceof Function) {
      this.query = updateFactory(this.query)
    } else {
      this.query = updateFactory
    }
    this.fetchResults(toHiragana(this.query, { passRomaji: true }))
  }

  async setCurrentEntry(sequenceNumber: number) {
    if (sequenceNumber === -1) {
      runInAction(() => {
        this.currentEntry = undefined
      })
      return
    }
    const requestID = ++this.entry
    const db = await this.dbPromise

    const tx = db.transaction('allPhrases')

    const result = await tx.store.get(sequenceNumber)

    if (this.entry === requestID) {
      runInAction(() => {
        this.currentEntry = result
      })
    }
  }

  private async fetchResults(query: string) {
    if (query === '') {
      runInAction(() => {
        this.results = []
      })
      return
    }
    const requestID = ++this.request

    const sequenceNumbers = new Set<number>()

    await this.fetchExactSequenceNumbers(query, sequenceNumbers)
    await this.fetchPartialSequenceNumbers(query, sequenceNumbers)

    const db = await this.dbPromise
    const tx = db.transaction('allPhrases')

    const results: JMEntry[] = []

    await Promise.all(
      Array.from(sequenceNumbers).map(async (number) => {
        const entry = await tx.store.get(number)

        results.push(entry)
      })
    )

    if (requestID === this.request) {
      runInAction(() => {
        this.results = results
      })
    }
  }

  private async fetchExactSequenceNumbers(
    query: string,
    sequenceNumbers: Set<number>
  ) {
    const db = await this.dbPromise

    const tx = db.transaction('queryStore')

    await tx.store
      .index('exact')
      .getAll(query)
      .then((matches) => {
        matches.forEach(({ sequenceNumber }) => {
          sequenceNumbers.add(sequenceNumber)
        })
      })

    await tx.done
  }

  private async fetchPartialSequenceNumbers(
    query: string,
    sequenceNumbers: Set<number>
  ) {
    const db = await this.dbPromise

    const tx = db.transaction('queryStore')

    await Promise.all([
      tx.store
        .index('exact')
        .getAll(IDBKeyRange.bound(query, query + '\uffff'), 30)
        .then((matches) => {
          matches.forEach(({ sequenceNumber }) => {
            sequenceNumbers.add(sequenceNumber)
          })
        }),
      tx.store
        .index('partial')
        .getAll(IDBKeyRange.bound(query, query + '\uffff'), 30)
        .then((matches) => {
          matches.forEach(({ sequenceNumber }) => {
            sequenceNumbers.add(sequenceNumber)
          })
        })
    ])

    await tx.done
  }
}

const store = new KamatamaJishoStore()
export default store
