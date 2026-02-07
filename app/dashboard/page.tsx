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
  user_id: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [ads, setAds] = useState<Ad[]>([])

  // 1. Fetch businesses belonging ONLY to the logged-in user
  useEffect(() => {
    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id) // This ensures persistence for the right user
        .order('created_at', { ascending: false })

      if (!error && data) {
        setAds(data)
      }
      setLoading(false)
    }

    loadDashboard()
  }, [router])

  // 2. Delete Logic (Row + Image Cleanup)
  async function handleDelete(ad: Ad) {
    const confirmed = window.confirm(`Are you sure you want to delete "${ad.name}"?`);
    if (!confirmed) return;

    // Delete image from storage bucket if it exists
    if (ad.image_url) {
      const fileName = ad.image_url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('business-images').remove([fileName]);
      }
    }

    // Delete row from database
    const { error } = await supabase.from('businesses').delete().eq('id', ad.id);

    if (!error) {
      setAds(ads.filter(a => a.id !== ad.id));
    } else {
      alert("Error deleting: " + error.message);
    }
  }

  if (loading) return <div className="p-10 text-center">Loading your dashboard...</div>

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600">You have posted {ads.length} business(es)</p>
          </div>
          <Link
            href="/post-business"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
          >
            + Post Another Business
          </Link>
        </div>

        {ads.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl text-center shadow-sm border">
            <p className="text-gray-500 mb-4">You haven't posted any businesses yet.</p>
            <Link href="/post-business" className="text-blue-600 font-bold hover:underline">
              Create your first listing now →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ads.map(ad => (
              <div key={ad.id} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
                {ad.image_url && (
                  <img src={ad.image_url} alt={ad.name} className="h-48 w-full object-cover" />
                )}
                
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{ad.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${
                      ad.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {ad.status || 'pending'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{ad.description}</p>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Link 
                      href={`/business/${ad.id}`} 
                      className="text-sm font-medium text-gray-600 hover:text-blue-600"
                    >
                      View
                    </Link>
                    <Link 
                      href={`/edit-business/${ad.id}`} 
                      className="text-sm font-medium text-amber-600 hover:text-amber-700"
                    >
                      Update
                    </Link>
                    <button 
                      onClick={() => handleDelete(ad)}
                      className="text-sm font-medium text-red-600 hover:text-red-700"
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