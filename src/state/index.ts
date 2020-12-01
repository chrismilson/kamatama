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
    const query = toHiragana(this.query, { passRomaji: true })
    this.fetchResults(query)
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
