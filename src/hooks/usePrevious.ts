import { useEffect, useRef } from 'react'

/**
 * Provides the value of a target parameter on the previous **render** (Even if
 * the target is unchanged).
 *
 * @param target The value to track
 */
function usePrevious<T>(target: T): T | undefined {
  const prevRef = useRef<T | undefined>()

  useEffect(() => {
    prevRef.current = target
  }, [target])

  return prevRef.current
}

export default usePrevious
