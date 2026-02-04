import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="bg-gray-50">
      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            Advertise Your Business with Confidence
          </h1>

          <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
            PlugMe helps South African businesses and online sellers
            reach real customers through paid, verified adverts.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/post-ad"
              className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg"
            >
              Post an Ad
            </Link>

            <Link
              href="/listings"
              className="border border-white px-8 py-4 rounded-xl font-semibold text-lg"
            >
              Browse Ads
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center">
            How PlugMe Works
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="font-semibold text-lg">
                Create Your Ad
              </h3>
              <p className="text-gray-600 mt-2">
                Add your business details, contact info, and image.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="text-3xl mb-3">💳</div>
              <h3 className="font-semibold text-lg">
                Pay Securely
              </h3>
              <p className="text-gray-600 mt-2">
                All adverts are paid to ensure quality listings.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-semibold text-lg">
                Get Discovered
              </h3>
              <p className="text-gray-600 mt-2">
                Your ad goes live after approval.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY PLUGME */}
      <section className="bg-white px-4 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold">
            Why Choose PlugMe?
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <h3 className="font-semibold">Paid Ads Only</h3>
              <p className="text-gray-600 mt-2">
                No spam. No fake listings. Only serious businesses.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Local Focus 🇿🇦</h3>
              <p className="text-gray-600 mt-2">
                Built specifically for South African entrepreneurs.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Mobile Friendly</h3>
              <p className="text-gray-600 mt-2">
                Most customers browse on phones — we optimise for that.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto bg-blue-600 text-white rounded-3xl p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Ready to Promote Your Business?
          </h2>

          <p className="mt-3 text-blue-100">
            Post your business today and start getting noticed.
          </p>

          <Link
            href="/post-ad"
            className="inline-block mt-6 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg"
          >
            Post an Ad
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} PlugMe · South Africa
      </footer>
    </main>
  )
}

