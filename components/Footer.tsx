import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Plug<span className="text-blue-600">Me</span>
            </h3>
            <p className="mt-3 text-sm text-gray-600">
              Discover and promote trusted local businesses.
              Built to connect communities and grow opportunities.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              Product
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/listings" className="hover:text-gray-900">
                  Browse Businesses
                </Link>
              </li>
              <li>
                <Link href="/post-business" className="hover:text-gray-900">
                  Post a Business
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-gray-900">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              Company
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/about" className="hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              Legal
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/privacy" className="hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} PlugMe. All rights reserved.
          </p>

          <p className="text-sm text-gray-500">
            Built with ❤️ for local businesses
          </p>
        </div>
      </div>
    </footer>
  )
}
