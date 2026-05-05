import { useEffect } from 'react'
import { useUIStore } from '../../store'

export function Toast() {
  const { toastMessage, hideToast } = useUIStore()

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(hideToast, 2000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage, hideToast])

  if (!toastMessage) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-dark-card text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
      {toastMessage}
    </div>
  )
}
