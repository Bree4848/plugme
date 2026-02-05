'use client'

import { useEffect, useState } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setVisible(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white px-6 py-4 shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          We use cookies to improve your experience. By clicking “Accept”, you
          agree to our use of cookies. Read our{' '}
          <a href="/privacy" className="underline hover:text-gray-900">
            Privacy Policy
          </a>.
        </p>

        <div className="flex gap-3">
          <button
            onClick={declineCookies}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
          >
            Decline
          </button>

          <button
            onClick={acceptCookies}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
