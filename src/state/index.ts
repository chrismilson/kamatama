import { IDBPDatabase } from 'idb'
import { makeAutoObservable, runInAction } from 'mobx'
import { toHiragana } from 'wanakana'
import initDB from '../dictionary'
import { JMEntry } from '../types/JMEntry'
import { KanjiCharacter } from '../types/Kanji'

/**
 * Represents a store of the app's state.
 */
export class KamatamaJishoStore {
  /** The current search query. */
  query: string
  dbPromise: Promise<IDBPDatabase>

  /**
   * A counter to increment on result fetching.
   *
   * If the results come back and the counter has been increased, we should
   * abandon the results.
   */
  phraseQueryIDPool: number
  phraseResults: JMEntry[]

  /**
   * See `phraseQueryIDPool`.
   */
  entryQueryIDPool: number
  /**
   * The currently selected entry. Will be undefined if there is no selected
   * entry.
   */
  currentEntry?: JMEntry

  /**
   * See `phraseQueryIDPool`.
   */
  kanjiQueryIDPool: number
  kanjiResults: KanjiCharacter[]

  constructor() {
    makeAutoObservable(this)

    this.query = ''
    this.dbPromise = initDB()

    this.phraseQueryIDPool = 0
    this.phraseResults = []

    this.entryQueryIDPool = 0
    // this.currentEntry = undefined

    this.kanjiQueryIDPool = 0
    this.kanjiResults = []
  }

  setQuery(updateFactory: string | ((priorQuery: string) => string)) {
    if (updateFactory instanceof Function) {
      this.query = updateFactory(this.query)
    } else {
      this.query = updateFactory
    }
    this.fetchPhraseResults(toHiragana(this.query, { passRomaji: true }))
  }

  async setCurrentEntry(sequenceNumber: number) {
    if (sequenceNumber === -1) {
      runInAction(() => {
        this.currentEntry = undefined
      })
      return
    }
    const requestID = ++this.entryQueryIDPool
    const db = await this.dbPromise

    const tx = db.transaction('allPhrases')

    const result = await tx.store.get(sequenceNumber)

    if (this.entryQueryIDPool === requestID) {
      runInAction(() => {
        this.currentEntry = result
      })
    }
  }

  private async fetchKanjiResults(query: string) {
    if (query === '') {
      runInAction(() => {
        this.kanjiResults = []
      })
      return
    }
    const requestID = ++this.kanjiQueryIDPool
    const literals = []
  }

  /**
   * Searches the phrases for any matches to the given query and updates the
   * results when done.
   */
  private async fetchPhraseResults(query: string) {
    if (query === '') {
      runInAction(() => {
        this.phraseResults = []
      })
      return
    }
    const requestID = ++this.phraseQueryIDPool

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

    if (requestID === this.phraseQueryIDPool) {
      runInAction(() => {
        this.phraseResults = results
      })
    }
  }

  /**
   * Searches the query store to find any exact matches.
   *
   * @param query The query to match exactly
   * @param sequenceNumbers A set to populate with the results of the query.
   */
  private async fetchExactSequenceNumbers(
    query: string,
    sequenceNumbers: Set<number>
  ) {
    const db = await this.dbPromise

    const tx = db.transaction('phraseQueryStore')

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

  /**
   * Searches the query store to find any partial matches.
   *
   * @param query The query to match exactly
   * @param sequenceNumbers A set to populate with the results of the query.
   */
  private async fetchPartialSequenceNumbers(
    query: string,
    sequenceNumbers: Set<number>
  ) {
    const db = await this.dbPromise

    const tx = db.transaction('phraseQueryStore')

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
