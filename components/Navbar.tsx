'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

const ADMIN_EMAILS = ['admin@plugme.co.za'] // change if needed

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const isAdmin =
    user && ADMIN_EMAILS.includes(user.email ?? '')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    setMenuOpen(false)
  }

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-gray-900"
          >
            Plug<span className="text-blue-600">Me</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/listings"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            >
              Listings
            </Link>

            {user && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                Dashboard
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-semibold text-red-600 hover:text-red-700"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="text-sm font-medium text-gray-500 hover:text-red-600 transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile / Tablet Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="/listings"
              onClick={() => setMenuOpen(false)}
              className="block text-base font-medium text-gray-700"
            >
              Listings
            </Link>

            {user && (
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block text-base font-medium text-gray-700"
              >
                Dashboard
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="block text-base font-semibold text-red-600"
              >
                Admin
              </Link>
            )}

            <div className="pt-4 border-t">
              {!user ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block text-gray-700 mb-3"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg bg-blue-600 py-2 text-center font-semibold text-white"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <button
                  onClick={logout}
                  className="block w-full text-left font-medium text-red-600"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
