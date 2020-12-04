import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import store from '../../state'
import { JMEntry } from '../../types/JMEntry'
import './Results.scss'

const ResultListItem: FC<JMEntry> = observer(
  ({ sequenceNumber, reading, kanji, sense }) => {
    return (
      <li
        className="ResultListItem"
        onClick={() => {
          store.setCurrentEntry(sequenceNumber)
        }}
      >
        <div className="forms">
          {
            [...kanji, ...reading]
              .sort((a, b) => a.priority.length - b.priority.length)
              .map((form) => form.value)
              .join('、') // We should join Japanese with the full width comma.
          }
        </div>
        <div className="meanings">
          {sense
            .flatMap((meaning) => meaning.glossary)
            .map((glossary) => glossary.value)
            .join(', ')}
        </div>
      </li>
    )
  }
)

/**
 * A list of the results for the current query.
 */
const ResultList: FC<{
  results: JMEntry[]
}> = observer(() => {
  const { phraseResults } = store

  return (
    <ul className="ResultList">
      {phraseResults.map((phrase) => (
        <ResultListItem key={phrase.sequenceNumber} {...phrase} />
      ))}
    </ul>
  )
})

export default ResultList
