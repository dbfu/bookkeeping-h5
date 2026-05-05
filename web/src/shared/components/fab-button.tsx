import { Link } from 'react-router-dom'

export function FABButton() {
  return (
    <Link
      to="/add"
      className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/40 flex items-center justify-center z-40 hover:scale-105 active:scale-95 transition-transform"
    >
      <svg className="w-7 h-7 text-dark-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </Link>
  )
}
