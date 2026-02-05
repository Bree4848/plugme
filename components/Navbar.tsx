'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)


  const handleLogout = async () => {
  await supabase.auth.signOut()
  window.location.href = '/'
}

useEffect(() => {
  if (!isAdmin) return

  const fetchUnreadCount = async () => {
    const { count } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)

    setUnreadCount(count || 0)
  }

  fetchUnreadCount()
}, [isAdmin])
 

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        setIsAdmin(data?.role === 'admin')
      }
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsAdmin(false)
      if (session?.user) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setIsAdmin(data?.role === 'admin')
          })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    setMenuOpen(false)
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
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
            Home
          </Link>

          <Link href="/businesses" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
            Businesses
          </Link>

          <Link href="/about" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
            About
          </Link>

          <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
            Contact
          </Link>


          {user && (
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
              Dashboard
            </Link>
          )}

         {isAdmin && (
  <>
    <Link
      href="/admin"
      className="text-sm font-semibold text-red-600 hover:text-blue-600 transition-colors duration-200"
    >
      Admin
    </Link>

    <Link
  href="/admin/messages"
  className="relative text-sm font-semibold text-red-600 hover:text-blue-600 transition-colors duration-200"
>
  Messages

  {unreadCount > 0 && (
    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
      {unreadCount}
    </span>
  )}
</Link>
<Link href="/admin/logs" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
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
            <button onClick={logout} className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200">
              Logout
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-gray-600"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
  <div className="md:hidden absolute top-full left-0 w-full bg-white border-t shadow-lg z-50">
    <nav className="flex flex-col divide-y">
      <Link
        href="/"
        onClick={() => setMenuOpen(false)}
        className="px-6 py-4 text-base font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
      >
        Home
      </Link>

      <Link
        href="/businesses"
        onClick={() => setMenuOpen(false)}
        className="px-6 py-4 text-base font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200">
         Businesses
      </Link>
      <Link
        href="/about"
        onClick={() => setMenuOpen(false)}
        className="px-6 py-4 text-base font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200">
            About
      </Link>

     <Link
       href="/contact"
       onClick={() => setMenuOpen(false)}
       className="px-6 py-4 text-base font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200">
        Contact
     </Link>


      {!user && (
        <>
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="px-6 py-4 text-base font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200">
            Login
          </Link>

          <Link
            href="/register"
            onClick={() => setMenuOpen(false)}
            className="px-6 py-4 text-base font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200">
            Register
          </Link>
        </>
      )}

      {user && (
        <>
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="px-6 py-4 text-base font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200">
            Dashboard
          </Link>



      
        </>
      )}
      {isAdmin && (
  <>
    <Link
      href="/admin"
      onClick={() => setMenuOpen(false)}
      className="px-6 py-4 text-base font-medium text-red-600 hover:text-blue-600 transition-colors duration-200"
    >
      Admin
    </Link>
    <Link
  href="/admin/logs"
  onClick={() => setMenuOpen(false)}
  className="px-6 py-4 text-base font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
>
  Logs
</Link>


    <Link
  href="/admin/messages"
  onClick={() => setMenuOpen(false)}
  className="flex items-center justify-between px-6 py-4 text-base font-medium text-red-600 hover:text-blue-600 transition-colors duration-200"
>
  <span>Messages</span>

  {unreadCount > 0 && (
    <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
      {unreadCount}
    </span>
  )}
</Link>


        <button
            onClick={handleLogout}
            className="px-6 py-4 text-left text-base font-medium text-red-600 hover:bg-red-50">
            Logout
          </button>
  </>
)}

    </nav>
  </div>
)}

    </header>
  )
}
