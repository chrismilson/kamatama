import { FC, useCallback, useEffect, useState } from 'react'
import initDB from '../../dictionary'
import {
  addDataIfNeeded,
  totalKanji,
  totalPhrases
} from '../../dictionary/add-data'
import { ReactComponent as Icon } from '../icon.svg'
import './Landing.scss'

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}

const Landing: FC = () => {
  const [installed, setInstalled] = useState(true)
  const [installing, setInstalling] = useState(false)
  const [progress, setProgress] = useState(0)

  // Can the UA install PWAs?
  const canInstall = 'serviceWorker' in navigator && 'indexedDB' in window
  const [
    installPromptEvent,
    setInstallPromptEvent
  ] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (canInstall) {
      initDB().then(async (db) => {
        const kanjiCount = await db.count('allKanji')
        const phraseCount = await db.count('allPhrases')

        if (kanjiCount < 13108 || phraseCount < 190269) {
          setInstalled(false)
        }
      })
    } else {
      setInstalled(false)
    }
  }, [canInstall])

  // If the user can be prompted to install the app, we want to do that.
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()

      setInstallPromptEvent((e as unknown) as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  // If the app should be installed, we should add the data to the db and prompt
  // the user to install the standalone PWA.
  const handleInstall = useCallback(() => {
    if (installed || !canInstall || installing) {
      return
    }

    setInstalling(true)
    initDB()
      .then((db) =>
        addDataIfNeeded(db, (progress) => {
          setProgress(
            Math.floor((100 * progress) / (totalKanji + totalPhrases))
          )
        })
      )
      .then(() => {
        if (installPromptEvent !== null) {
          installPromptEvent.prompt()
        }
        setInstalled(true)
      })
  }, [installPromptEvent, installed, canInstall, installing])

  return (
    <div
      className={['Landing', installed && 'installed']
        .filter(Boolean) // removes falsy classnames
        .join(' ')}
    >
      <div className="content">
        <h1>こんにちは!</h1>
        <p>
          This is Kamatama Jisho, a Japanese-English phrase book powered by the
          web!
        </p>
        {canInstall ? (
          <p>To install Kamatama Jisho, just press the big egg down below.</p>
        ) : (
          <p>
            Uh oh! The device you are using is not capable of installing{' '}
            <a href="https://en.wikipedia.org/wiki/Progressive_web_application">
              PWAs
            </a>
            . Perhaps try a different device, or a different browser!
          </p>
        )}
      </div>
      {canInstall && (
        <button className="icon">
          <div
            className={['progress', installing && 'visible']
              .filter(Boolean)
              .join(' ')}
          >
            {progress}%
          </div>
          <Icon onClick={handleInstall} />
        </button>
      )}
    </div>
  )
}

export default Landing
