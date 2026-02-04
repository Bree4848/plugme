'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Business = {
  id: string
  name: string
  description: string
  image_url: string | null
  contact_person: string
  phone: string
  email: string
}

export default function ListingsPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBusinesses() {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setBusinesses(data)
      }

      setLoading(false)
    }

    fetchBusinesses()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading businesses...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Registered Businesses
          </h1>
          <p className="text-gray-600 mt-2">
            Discover trusted businesses on PlugMe
          </p>
        </div>

        {businesses.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
            No businesses available yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map(business => (
              <div
                key={business.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                {business.image_url && (
                  <img
                    src={business.image_url}
                    alt={business.name}
                    className="w-full h-44 object-cover"
                  />
                )}

                <div className="p-5">
                  <a href={`/business/${business.id}`}
                    className="block text-lg font-semibold hover:underline text-blue-600">
                     {business.name}
                 </a>

                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                    {business.description}
                  </p>
                  
                  <div className="mt-4 border-t pt-4 text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-medium">Contact:</span>{' '}
                      {business.contact_person}
                    </p>
                    <p>{business.phone}</p>
                    <p>{business.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
