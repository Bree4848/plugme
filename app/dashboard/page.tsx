'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [ads, setAds] = useState<Ad[]>([])

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setAds(data)
      }

      setLoading(false)
    }

    loadDashboard()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    )
  }
  async function deleteBusiness(ad: Ad) { // Now we pass the whole 'ad' object
  const confirmed = window.confirm(`Are you sure you want to delete "${ad.name}"?`);
  if (!confirmed) return;

  // 1. Storage Cleanup
  if (ad.image_url) {
    const urlParts = ad.image_url.split('/');
    const fileName = urlParts[urlParts.length - 1];

    // Remove file from the bucket
    await supabase.storage
      .from('business-images')
      .remove([fileName]);
  }

  // 2. Database Cleanup
  const { error } = await supabase
    .from('businesses')
    .delete()
    .eq('id', ad.id);

  if (!error) {
    setAds(ads.filter(item => item.id !== ad.id));
    // You could also trigger a Toast here instead of an alert!
  } else {
    alert("Error: " + error.message);
  }
}

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Dashboard</h1>
            <p className="text-gray-600">
              Manage your adverts on PlugMe
            </p>
          </div>

          <Link
            href="/post-ad"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-center"
          >
            + Post New Ad
          </Link>
        </div>

        {/* Ads */}
        {ads.length === 0 ? (
          <div className="mt-12 bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-gray-600">
              You haven’t posted any ads yet.
            </p>

            <Link
              href="/post-ad"
              className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Post Your First Ad
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {ads.map(ad => (
    <div key={ad.id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {ad.image_url && (
        <img src={ad.image_url} alt={ad.name} className="w-full h-40 object-cover" />
      )}

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{ad.name}</h3>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            ad.status === 'approved' ? 'bg-green-100 text-green-700' : 
            ad.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {ad.status || 'pending'}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{ad.description}</p>

        {/* ACTIONS SECTION */}
        <div className="mt-auto pt-4 border-t flex flex-wrap gap-3">
          <Link
            href={`/business/${ad.id}`} // Fixed path
            className="text-blue-600 font-medium text-sm hover:underline"
          >
            View
          </Link>

          <Link
            href={`/edit-business/${ad.id}`} // New Edit path
            className="text-amber-600 font-medium text-sm hover:underline"
          >
            Update
          </Link>

          <button 
            onClick={() => deleteBusiness(ad)} // After: passing the whole 'ad' object
            className="text-red-600 font-medium text-sm hover:underline"
          >
            Delete
          </button>
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

