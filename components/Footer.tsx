'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Footer() {
  const router = useRouter()

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
        {/* Adjusted Grid: 1 column on tiny phones, 2 on small tablets, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          
          {/* Column 1: PlugMe */}
          <div className="space-y-4">
            <Link href="/" className="text-xl font-bold">
              Plug<span className="text-blue-600">Me</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Connecting you with the best local businesses in your area.
            </p>
          </div>

          {/* Column 2: Businesses */}
          <div>
            <h4 className="font-bold mb-4 text-gray-900">Businesses</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/businesses" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Businesses
                </Link>
              </li>
              <li>
                <a 
                  href="/post-business"
                  onClick={(e) => handleProtectedLink(e, '/post-business')}
                  className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  Post a Business
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-bold mb-4 text-gray-900">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="font-bold mb-4 text-gray-900">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>
        
        {/* Bottom Bar: Better spacing and subtle border */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} PlugMe. All rights reserved.</p>
          <div className="flex gap-6">
            {/* Added social placeholders or extra links if you ever want them here */}
          </div>
        </div>
      </div>
    </footer>
  )
}