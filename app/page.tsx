'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function HomePage() {
  const [ad, setAd] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  // Get logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  // Fetch latest approved ad
  useEffect(() => {
    const fetchLatestAd = async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle() // ✅ IMPORTANT: avoids crash if no ads

      if (!error) {
        setAd(data)
      }
    }

    fetchLatestAd()
  }, [])

  // Prepare media URL safely
  let publicUrl: string | null = null

  if (ad?.media_url) {
    const { data } = supabase.storage
      .from('ads')
      .getPublicUrl(ad.media_url)

    publicUrl = data?.publicUrl ?? null
  }

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

              <Link
                href="/post-business"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Post Your Business
              </Link>
            </div>
          </div>

          {/* RIGHT: AD CARD (OPTIONAL) */}
          <div className="relative">
            {ad && publicUrl ? (
              <div className="overflow-hidden rounded-2xl border bg-white shadow-lg">

                {/* IMAGE */}
                {ad.media_type?.startsWith('image/') && (
                  <img
                    src={publicUrl}
                    alt={ad.title}
                    className="h-64 w-full object-cover"
                  />
                )}

                {/* VIDEO */}
                {ad.media_type?.startsWith('video/') && (
                  <video
                    src={publicUrl}
                    className="h-64 w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {ad.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(ad.created_at).toLocaleString(undefined, {
                        timeZoneName: 'short',
                      })}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      (window.location.href = user ? '/post-ad' : '/login')
                    }
                    className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                  >
                    Advertise with us
                  </button>
                </div>
              </div>
            ) : (
              // Fallback skeleton if no ads yet
              <div className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
