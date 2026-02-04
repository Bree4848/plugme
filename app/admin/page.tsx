'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

const ADMIN_EMAILS = ['admin@plugme.co.za'] // change this

type Business = {
  id: string
  name: string
  description: string
  contact_person: string
  created_at: string
}

export default function AdminPage() {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
        router.push('/')
        return
      }

      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (data) setBusinesses(data)
      setLoading(false)
    }

    loadAdmin()
  }, [router])

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    await supabase
      .from('businesses')
      .update({ status })
      .eq('id', id)

    setBusinesses(prev =>
      prev.filter(business => business.id !== id)
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading admin panel...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Pending Businesses
        </h1>

        {businesses.length === 0 ? (
          <div className="bg-white p-6 rounded-xl text-center">
            No pending businesses 🎉
          </div>
        ) : (
          <div className="space-y-4">
            {businesses.map(business => (
              <div
                key={business.id}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <h3 className="text-lg font-semibold">
                  {business.name}
                </h3>

                <p className="text-gray-600 mt-2">
                  {business.description}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  Contact: {business.contact_person}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() =>
                      updateStatus(business.id, 'approved')
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(business.id, 'rejected')
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
