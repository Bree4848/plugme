'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // 1. Helper function to fetch the count
  async function fetchUnreadCount() {
    const { count } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
    
    setUnreadCount(count || 0)
  }

  useEffect(() => {
    let messageChannel: any; // 2. Variable to hold the realtime subscription

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
          // 3. Initial count fetch
          fetchUnreadCount()

          // 4. REALTIME SUBSCRIPTION: Listen for deletes or updates
          messageChannel = supabase
            .channel('db-changes')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'contact_messages' },
              () => {
                fetchUnreadCount() // Recount when any message is deleted/changed
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

    // 5. Cleanup both the Auth listener and the Realtime channel
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
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          Plug<span className="text-blue-600">Me</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">
            Home
          </Link>

          <Link href="/businesses" className="text-sm text-gray-600 hover:text-blue-600">
            Businesses
          </Link>

          <Link href="/about" className="text-sm text-gray-600 hover:text-blue-600">
            About
          </Link>

          <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600">
            Contact
          </Link>

          {user && (
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-blue-600">
              Dashboard
            </Link>
          )}

          {isAdmin && (
            <>
              <div className="h-6 w-[1px] bg-gray-200 mx-2" />
              <Link href="/admin" className="text-sm font-bold text-red-600 hover:text-red-700">
                Admin
              </Link>
              <Link href="/admin/messages" className="relative text-sm font-semibold text-gray-700 hover:text-blue-600">
                Messages
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-[10px] text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link href="/admin/logs" className="text-sm text-gray-600 hover:text-blue-600">
                Logs
              </Link>
            </>
          )}
        </nav>

        {/* Desktop auth */}
        <div className="hidden lg:flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/login" className="text-sm text-gray-600">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Get Started
              </Link>
            </>
          ) : (
            <button onClick={logout} className="text-sm text-gray-500 hover:text-blue-600 font-medium">
              Logout
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-gray-600 text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t shadow-lg z-50">
          <nav className="flex flex-col divide-y">
            <Link href="/" onClick={() => setMenuOpen(false)} className="px-6 py-4">
              Home
            </Link>
            <Link href="/businesses" onClick={() => setMenuOpen(false)} className="px-6 py-4">
              Businesses
            </Link>
            {isAdmin && (
              <>
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="px-6 py-4 text-red-600 font-bold">
                  Admin Panel
                </Link>
                <Link href="/admin/messages" onClick={() => setMenuOpen(false)} className="px-6 py-4 flex justify-between">
                   <span>Messages</span>
                   {unreadCount > 0 && (
                     <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-xs">
                       {unreadCount}
                     </span>
                   )}
                </Link>
              </>
            )}
            {user ? (
              <button onClick={logout} className="px-6 py-4 text-left text-red-600">
                Logout
              </button>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="px-6 py-4">
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}