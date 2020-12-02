import { FC } from 'react'
import { JMEntry } from '../../../types/JMEntry'
import Meaning from './Meaning'

const Word: FC<JMEntry> = ({ kanji, reading, sense }) => {
  return (
    <div className="PhraseData">
      <ul className="kanjis">
        {kanji.map(({ value }) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
      {kanji.length > 0 && reading.length > 0 && <h2>Reading</h2>}
      <ul className="readings">
        {reading.map(({ value }) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
      <h2>Meaning</h2>
      <ul className="meanings">
        {sense.map((sense, i) => (
          <Meaning key={i} {...sense} />
        ))}
      </ul>
    </div>
  )
}

export default Word
