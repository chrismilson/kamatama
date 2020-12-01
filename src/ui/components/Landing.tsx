import { FC, useCallback, useEffect, useState } from 'react'
import initDB from '../../dictionary'
import { addDataIfNeeded } from '../../dictionary/add-data'
import { register } from '../../serviceWorkerRegistration'
import { ReactComponent as Icon } from '../icon.svg'
import './Landing.scss'

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}

const Landing: FC = () => {
  const [installed, setInstalled] = useState(true)
  // Can the UA install PWAs?
  const canInstall = 'serviceWorker' in navigator
  const [
    installPromptEvent,
    setInstallPromptEvent
  ] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      initDB().then(async (db) => {
        const kanjiCount = await db.count('allKanji')
        const phraseCount = await db.count('allPhrases')

        if (kanjiCount < 13108 || phraseCount < 190269) {
          setInstalled(false)
        }
      })
      return
    }

    // Is the app installed?
    if (canInstall) {
      if (navigator.serviceWorker.controller === null) {
        // the app is not installed
        setInstalled(false)
      } else {
        initDB().then(async (db) => {
          const kanjiCount = await db.count('allKanji')
          const phraseCount = await db.count('allPhrases')

          if (kanjiCount < 13108 || phraseCount < 190269) {
            setInstalled(false)
          }
        })
      }
    } else {
      setInstalled(false)
    }
  }, [canInstall])

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

  const handleInstall = useCallback(() => {
    const onSuccess = () => {
      // The service worker is now installed.
      setInstalled(true)
    }

    if (process.env.NODE_ENV === 'development') {
      initDB()
        .then((db) => addDataIfNeeded(db))
        .then(() => setInstalled(true))
      return
    }

    register({ onSuccess })

    if (
      installPromptEvent &&
      !window.matchMedia('(display-mode: standalone)').matches
    ) {
      installPromptEvent.prompt().catch(console.error)
    }
  }, [installPromptEvent])

  return (
    <div
      className={['Landing', installed && 'installed']
        .filter(Boolean)
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
        <button className="icon" onClick={handleInstall}>
          <Icon />
        </button>
      )}
    </div>
  )
}

export default Landing
