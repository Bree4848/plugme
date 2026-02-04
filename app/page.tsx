import Link from 'next/link'

export default function HomePage() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Text */}
          <div>
            <span className="inline-block rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-600">
              Discover • Connect • Grow
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Find trusted local businesses
              <span className="text-blue-600"> near you</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-gray-600">
              PlugMe helps customers discover verified local businesses
              and helps business owners get discovered, grow faster,
              and build trust in their community.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/listings"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Browse Businesses
              </Link>

              <Link
                href="/post-business"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Post Your Business
              </Link>
            </div>
          </div>

          {/* Right: Visual Card */}
          <div className="relative">
            <div className="rounded-2xl border bg-gray-50 p-6 shadow-sm">
              <div className="space-y-4">
                <div className="h-4 w-1/3 rounded bg-gray-200" />
                <div className="h-6 w-2/3 rounded bg-gray-300" />
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-5/6 rounded bg-gray-200" />

                <div className="mt-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 rounded bg-gray-300" />
                    <div className="h-3 w-32 rounded bg-gray-200" />
                  </div>
                </div>

                <div className="mt-6 h-10 w-full rounded-lg bg-blue-600 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
  
}