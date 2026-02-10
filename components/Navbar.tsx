'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  async function fetchUnreadCount() {
    const { count } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
    
    setUnreadCount(count || 0)
  }

  useEffect(() => {
    let messageChannel: any;

    async function loadUserAndRole() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()

        if (error) {
          console.error("Navbar Role Fetch Error:", error.message)
        }

        const isUserAdmin = profile?.role === 'admin'
        setIsAdmin(isUserAdmin)

        if (isUserAdmin) {
          fetchUnreadCount()

          messageChannel = supabase
            .channel('db-changes')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'contact_messages' },
              () => {
                fetchUnreadCount()
              }
            )
            .subscribe()
        }
      }
    }

    loadUserAndRole()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      if (currentUser) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .maybeSingle()
        
        const isUserAdmin = data?.role === 'admin'
        setIsAdmin(isUserAdmin)
        
        if (isUserAdmin) fetchUnreadCount()
      } else {
        setIsAdmin(false)
        setUnreadCount(0)
      }
    })

    return () => {
      subscription.unsubscribe()
      if (messageChannel) supabase.removeChannel(messageChannel)
    }
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false)
    window.location.href = '/'
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold dark:text-white">
          Plug<span className="text-blue-600">Me</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">
            Home
          </Link>
          <Link href="/businesses" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">
            Businesses
          </Link>
          <Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">
            About
          </Link>
          <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">
            Contact
          </Link>
          {user && (
            <Link href="/dashboard" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">
              Dashboard
            </Link>
          )}
          {isAdmin && (
            <>
              <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-800 mx-2" />
              <Link href="/admin" className="text-sm font-bold text-red-600 hover:text-red-700">
                Admin
              </Link>
              <Link href="/admin/messages" className="relative text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600">
                Messages
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-[10px] text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </>
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          {!user ? (
            <>
              <Link href="/login" className="text-sm text-gray-600 dark:text-gray-400">Login</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Get Started</Link>
            </>
          ) : (
            <button onClick={logout} className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 font-medium">Logout</button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-3">
          <ThemeToggle />
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600 dark:text-gray-300 text-2xl">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu - NOW PUSHES CONTENT DOWN */}
      {menuOpen && (
        <div className="lg:hidden w-full bg-white dark:bg-gray-950 border-t dark:border-gray-800">
          <nav className="flex flex-col divide-y dark:divide-gray-800">
            <Link href="/" onClick={() => setMenuOpen(false)} className="px-6 py-4 dark:text-gray-300">
              Home
            </Link>
            <Link href="/businesses" onClick={() => setMenuOpen(false)} className="px-6 py-4 dark:text-gray-300">
              Businesses
            </Link>
            {user && (
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="px-6 py-4 dark:text-gray-300 font-medium text-blue-600">
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <>
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="px-6 py-4 text-red-600 font-bold">
                  Admin Panel
                </Link>
                <Link href="/admin/messages" onClick={() => setMenuOpen(false)} className="px-6 py-4 flex justify-between dark:text-gray-300">
                   <span>Messages</span>
                   {unreadCount > 0 && (
                     <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-xs">{unreadCount}</span>
                   )}
                </Link>
              </>
            )}
            {user ? (
              <button onClick={logout} className="px-6 py-4 text-left text-red-600">Logout</button>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="px-6 py-4 dark:text-gray-300">Login</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}