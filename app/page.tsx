'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function HomePage() {
  const router = useRouter()
  const [ads, setAds] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Get logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  // Fetch registered businesses
  useEffect(() => {
    const fetchBusinesses = async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setAds(data)
      }
    }

    fetchBusinesses()
  }, [])

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (ads.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [ads])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length)
  }

  const currentBusiness = ads[currentIndex]

  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

          {/* LEFT: HERO TEXT */}
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
                href="/businesses"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Browse Businesses
              </Link>

              <button
                onClick={() => {
                  if (user) {
                    router.push('/post-business')
                  } else {
                    router.push('/login')
                  }
                }}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Post Your Business
              </button>
            </div>
          </div>

          {/* RIGHT: BUSINESSES SLIDER */}
          <div className="relative">
            {ads.length > 0 && currentBusiness ? (
              <div className="overflow-hidden rounded-2xl border bg-white shadow-lg">
                {/* IMAGE */}
                {currentBusiness.image_url ? (
                  <img
                    src={currentBusiness.image_url}
                    alt={currentBusiness.name}
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <div className="h-64 w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}

                {/* CONTENT */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {currentBusiness.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {currentBusiness.category}
                    </p>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {currentBusiness.description}
                  </p>

                  {/* VIEW BUTTON */}
                  <Link
                    href={`/ads/${currentBusiness.id}`}
                    className="inline-block w-full text-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                  >
                    View Business
                  </Link>
                </div>

                {/* NAVIGATION BUTTONS */}
                {ads.length > 1 && (
                  <div className="flex items-center justify-between px-4 pb-4 gap-2">
                    <button
                      onClick={goToPrevious}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                      aria-label="Previous business"
                    >
                      ←
                    </button>

                    {/* DOTS INDICATOR */}
                    <div className="flex gap-2 justify-center flex-1">
                      {ads.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`w-2 h-2 rounded-full transition ${
                            index === currentIndex
                              ? 'bg-blue-600'
                              : 'bg-gray-300'
                          }`}
                          aria-label={`Go to business ${index + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={goToNext}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                      aria-label="Next business"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Fallback skeleton if no businesses yet
              <div className="h-96 rounded-2xl bg-gray-100 animate-pulse" />
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
