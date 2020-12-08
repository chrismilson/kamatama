import { IDBPDatabase } from 'idb'
import { makeAutoObservable, runInAction } from 'mobx'
import { stringify } from 'querystring'
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

  radicalRequestIDPool: number
  /** A set of the radicals that the target kanji contains. */
  radicalQuery: Set<string>
  /**
   * Keeps a count of how many of the currently queried radicals are in each
   * kanji.
   */
  radicalMultiset: { [kanji: string]: number }
  /**
   * An array containing the kanji whose count in the multiset is equal to the
   * number of queried radicals. This will be the kanji who contain all queried
   * radicals.
   */
  radicalResult: KanjiCharacter[]

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

    this.radicalRequestIDPool = 0
    this.radicalQuery = new Set()
    this.radicalMultiset = {}
    this.radicalResult = []
  }

  setQuery(updateFactory: string | ((priorQuery: string) => string)) {
    if (updateFactory instanceof Function) {
      this.query = updateFactory(this.query)
    } else {
      this.query = updateFactory
    }
    this.fetchPhraseResults(
      toHiragana(this.query.toLowerCase(), { passRomaji: true })
    )
    this.fetchKanjiResults(toHiragana(this.query, { passRomaji: true }))
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
    await tx.done

    if (this.entryQueryIDPool === requestID) {
      runInAction(() => {
        this.currentEntry = result
      })
    }
  }

  async toggleRadicalQuery(radical: string) {
    let change: number
    if (this.radicalQuery.has(radical)) {
      change = -1
      this.radicalQuery.delete(radical)
    } else {
      change = 1
      this.radicalQuery.add(radical)
    }

    for (const literal of await this.fetchKanjiByRadical(radical)) {
      if (!(literal in this.radicalMultiset)) {
        this.radicalMultiset[literal] = 0
      }

      this.radicalMultiset[literal] += change

      if (this.radicalMultiset[literal] === 0) {
        delete this.radicalMultiset[literal]
      }
    }

    await this.updateRadicalResults()
  }

  private async updateRadicalResults() {
    const target = this.radicalQuery.size
    if (target === 0) {
      this.radicalResult = []
    }

    const literals = Object.entries(this.radicalMultiset)
      .filter(([kanji, count]) => count === target)
      .map(([kanji, count]) => kanji)

    const requestID = ++this.radicalRequestIDPool
    const db = await this.dbPromise
    const tx = db.transaction('allKanji')

    const result = await Promise.all(
      literals.map((literal) => tx.store.get(literal))
    )

    if (requestID === this.radicalRequestIDPool) {
      runInAction(() => {
        this.radicalResult = result
      })
    }
  }

  private async fetchKanjiByRadical(radical: string) {
    const db = await this.dbPromise
    const tx = db.transaction('allKanji')

    return tx.store.index('radical').getAllKeys(radical) as Promise<string[]>
  }

  private async fetchKanjiResults(query: string) {
    if (query === '') {
      runInAction(() => {
        this.kanjiResults = []
      })
      return
    }
    const requestID = ++this.kanjiQueryIDPool
    const allLiterals = new Set<string>()

    const db = await this.dbPromise

    // Get the literals by searching for their reaadings.
    const queryTx = db.transaction('kanjiQueryStore')

    await queryTx.store
      .index('reading')
      .getAll(query)
      .then((matches) =>
        matches.forEach(({ literal }) => allLiterals.add(literal))
      )

    await queryTx.done

    // Now get the characters by their literals.
    const results: KanjiCharacter[] = []

    const kanjiTx = db.transaction('allKanji')

    await Promise.all(
      Array.from(allLiterals).map(async (literal) => {
        const kanji = await kanjiTx.store.get(literal)

        results.push(kanji)
      })
    )

    if (requestID === this.kanjiQueryIDPool) {
      runInAction(() => {
        this.kanjiResults = results
      })
    }
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
