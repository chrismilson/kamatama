import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import store from '../../state'
import { JMEntry } from '../../types/JMEntry'
import './Results.scss'

const ResultListItem: FC<JMEntry> = ({ reading, kanji, sense }) => {
  return (
    <li className="ResultListItem">
      <div className="forms">
        {[...kanji, ...reading]
          .sort((a, b) => a.priority.length - b.priority.length)
          .map((form) => form.value)
          .join('、')}
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

/**
 * A list of the results for the current query.
 */
const ResultList: FC<{
  results: JMEntry[]
}> = observer(() => {
  const { results } = store

  return (
    <ul className="ResultList">
      {results.map((result) => (
        <ResultListItem key={result.sequenceNumber} {...result} />
      ))}
    </ul>
  )
})

export default ResultList
