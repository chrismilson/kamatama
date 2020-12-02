import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect } from 'react'
import usePrevious from '../../../hooks/usePrevious'
import store from '../../../state'
import './Phrase.scss'
import Word from './PhraseData'

/**
 * A page that contains the data for a phrase.
 */
const Phrase: FC = observer(() => {
  const entry = store.currentEntry
  const prevEntry = usePrevious(entry)
  const display = entry || prevEntry

  const closeHandler = useCallback(() => {
    store.setCurrentEntry(-1)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Esc' || e.key === 'Escape') {
        closeHandler()
      }
    }

    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [closeHandler])

  return (
    <div className={['Phrase', entry && 'valid'].filter(Boolean).join(' ')}>
      <button onClick={closeHandler}>close</button>
      {display && <Word {...display} />}
    </div>
  )
})

export default Phrase
