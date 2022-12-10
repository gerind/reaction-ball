import { useEffect } from 'react'
import { preventDefault } from '../core/utils'

export function usePreventSelectAndDrag() {
  useEffect(() => {
      document.addEventListener('dragstart', preventDefault)
      document.addEventListener('selectstart', preventDefault)
      return () => {
          document.removeEventListener('dragstart', preventDefault)
          document.removeEventListener('selectstart', preventDefault)
      }
  }, [])
}
