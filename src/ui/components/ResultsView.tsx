import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import store from '../../state'
import { JMEntry } from '../../types/JMEntry'

const JMEntryView: FC<JMEntry> = (obj) => {
  return (
    <li className="Kanji ResultView">
      <pre>{JSON.stringify(obj, null, 2)}</pre>
    </li>
  )
}

/**
 * A list of the results for the current query.
 */
const ResultsView: FC<{
  results: JMEntry[]
}> = observer(() => {
  const { results } = store

  return (
    <ul>
      {results.map((result) => (
        <JMEntryView key={result.sequenceNumber} {...result} />
      ))}
    </ul>
  )
})

export default ResultsView
