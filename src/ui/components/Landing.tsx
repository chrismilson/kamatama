import { FC, useCallback, useEffect, useState } from 'react'
import { register } from '../../serviceWorkerRegistration'
import { ReactComponent as Icon } from '../icon.svg'
import './Landing.scss'

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}

const Landing: FC = () => {
  // Can the UA install PWAs?
  const [canInstall, setCanInstall] = useState(false)
  const [
    installPromptEvent,
    setInstallPromptEvent
  ] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      setCanInstall(true)
    }
  }, [])

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
    register({
      onSuccess: () => {
        window.location.reload()
      }
    })
    if (
      installPromptEvent &&
      !window.matchMedia('(didsplay-mode: standalone)').matches
    ) {
      installPromptEvent.prompt().catch(console.error)
    }
  }, [installPromptEvent])

  return (
    <div className="Landing">
      <div className="content">
        <h1>こんにちは!</h1>
        <p>
          This is Kamatama Jisho, a Japanese-English phrase book powered by the
          web!.
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
