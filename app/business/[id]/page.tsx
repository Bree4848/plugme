'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams } from 'next/navigation'

type Business = {
  id: string
  name: string
  description: string
  image_url: string | null
  contact_person: string
  phone: string
  email: string
}

export default function BusinessDetailPage() {
  const { id } = useParams()
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBusiness() {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .eq('status', 'approved')
        .single()

      if (!error) {
        setBusiness(data)
      }

      setLoading(false)
    }

    fetchBusiness()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading business...
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Business not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Image */}
        {business.image_url && (
          <img
            src={business.image_url}
            alt={business.name}
            className="w-full h-60 object-cover"
          />
        )}

        {/* Content */}
        <div className="p-6">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {business.name}
          </h1>

          <p className="text-gray-600 mt-4">
            {business.description}
          </p>

          {/* Contact Section */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-semibold mb-3">
              Contact Information
            </h2>

            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Contact Person:</span>{' '}
                {business.contact_person}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{' '}
                <a
                  href={`tel:${business.phone}`}
                  className="text-blue-600"
                >
                  {business.phone}
                </a>
              </p>
              <p>
                <span className="font-medium">Email:</span>{' '}
                <a
                  href={`mailto:${business.email}`}
                  className="text-blue-600"
                >
                  {business.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
