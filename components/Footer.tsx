'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation' // Added
import { supabase } from '@/lib/supabaseClient' // Added

export default function Footer() {
  const router = useRouter() // Added

  // Added logic function
  const handleProtectedLink = async (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      router.push(path)
    } else {
      router.push(`/login?next=${path}`)
    }
  }

  return (
    <footer className="bg-white border-t py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Column 1: PlugMe (Unchanged) */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold">
              Plug<span className="text-blue-600">Me</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Connecting you with the best local businesses in your area.
            </p>
          </div>

          {/* Column 2: Businesses (Modified only the one link) */}
          <div>
            <h4 className="font-bold mb-4">Businesses</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/businesses" className="text-gray-600 hover:text-blue-600">
                  Businesses
                </Link>
              </li>
              <li>
                {/* Changed from Link to <a> with onClick logic */}
                <a 
                  href="/post-business"
                  onClick={(e) => handleProtectedLink(e, '/post-business')}
                  className="text-gray-600 hover:text-blue-600 cursor-pointer"
                >
                  Post a Business
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company (Unchanged) */}
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-600 hover:text-blue-600">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal (Unchanged) */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-gray-600 hover:text-blue-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-blue-600">Terms of Service</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PlugMe. All rights reserved.
        </div>
      </div>
    </footer>
  )
}