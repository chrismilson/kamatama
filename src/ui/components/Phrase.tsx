import { observer } from 'mobx-react-lite'
import { FC, useEffect, useRef } from 'react'
import store from '../../state'
import { JMEntry } from '../../types/JMEntry'
import './Phrase.scss'

const Phrase: FC = observer(() => {
  const entry = store.currentEntry
  const prevEntry = useRef<JMEntry>()

  useEffect(() => {
    prevEntry.current = entry
  }, [entry])

  const display = entry || prevEntry.current

  return (
    <div className={['Phrase', entry && 'valid'].filter(Boolean).join(' ')}>
      <button onClick={() => store.setCurrentEntry(-1)}>close</button>
      <pre>{JSON.stringify(display, null, 2)}</pre>
    </div>
  )
})

export default Phrase
