'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

type Ad = {
  id: string
  name: string
  description: string
  status?: string
  image_url: string | null
  category?: string
  contact_person?: string
  phone?: string
  email?: string
  created_at?: string
}

export default function AdViewPage() {
  const params = useParams()
  const router = useRouter()
  const adId = params.id as string

  const [ad, setAd] = useState<Ad | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAd() {
      if (!adId) return

      const { data, error: fetchError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', adId)
        .single()

      if (fetchError) {
        setError('Ad not found')
        setLoading(false)
        return
      }

      if (data) {
        setAd(data)
      }

      setLoading(false)
    }

    loadAd()
  }, [adId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading ad details...
      </div>
    )
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-red-600 mb-4">{error || 'Ad not found'}</p>
        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-700 font-medium mb-6 inline-flex items-center gap-2"
        >
          ← Back to Dashboard
        </Link>

        {/* Ad Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Image */}
          {ad.image_url && (
            <img
              src={ad.image_url}
              alt={ad.name}
              className="w-full h-96 object-cover"
            />
          )}

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {ad.name}
                </h1>
                {ad.category && (
                  <p className="text-gray-600 mt-2">
                    Category: <span className="font-medium">{ad.category}</span>
                  </p>
                )}
              </div>

              <span
                className={`text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap ${
                  ad.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : ad.status === 'rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {ad.status}
              </span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {ad.description}
              </p>
            </div>

            {/* Contact Info */}
            <div className="border-t pt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {ad.contact_person && (
                  <div>
                    <p className="text-gray-600 text-sm">Contact Person</p>
                    <p className="font-medium text-gray-900">
                      {ad.contact_person}
                    </p>
                  </div>
                )}

                {ad.phone && (
                  <div>
                    <p className="text-gray-600 text-sm">Phone</p>
                    <a
                      href={`tel:${ad.phone}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      {ad.phone}
                    </a>
                  </div>
                )}

                {ad.email && (
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <a
                      href={`mailto:${ad.email}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      {ad.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Posted Date */}
            {ad.created_at && (
              <div className="mt-8 pt-6 border-t text-gray-600 text-sm">
                Posted on {new Date(ad.created_at).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
