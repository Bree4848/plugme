'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Business = {
  id: string
  name: string
  status: string
  category: string
}

type Profile = {
  id: string
  email: string
  role: string
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'businesses' | 'users'>('businesses')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  async function fetchData() {
    setLoading(true)
    if (activeTab === 'businesses') {
      const { data } = await supabase.from('businesses').select('*').order('created_at', { ascending: false })
      setBusinesses(data || [])
    } else {
      const { data } = await supabase.from('profiles').select('*').order('email', { ascending: true })
      setProfiles(data || [])
    }
    setLoading(false)
  }

  // --- Business Actions ---
  async function updateBusinessStatus(id: string, newStatus: string) {
    await supabase.from('businesses').update({ status: newStatus }).eq('id', id)
    fetchData()
  }

  // --- User Role Actions ---
  async function toggleUserRole(id: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id)
    
    if (error) alert("Error updating role: " + error.message)
    else fetchData()
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tab Switcher */}
      <div className="flex border-b mb-6">
        <button 
          onClick={() => setActiveTab('businesses')}
          className={`px-6 py-2 font-medium ${activeTab === 'businesses' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Manage Businesses
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2 font-medium ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Manage Users
        </button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {activeTab === 'businesses' ? (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3">Business</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {businesses.map(b => (
                <tr key={b.id}>
                  <td className="px-6 py-4 font-medium">{b.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${b.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => updateBusinessStatus(b.id, b.status === 'approved' ? 'pending' : 'approved')}
                      className="text-xs text-blue-600 font-bold"
                    >
                      {b.status === 'approved' ? 'Reject' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Current Role</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {profiles.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4">{p.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${p.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                      {p.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => toggleUserRole(p.id, p.role)}
                      className="text-xs bg-gray-100 px-3 py-1.5 rounded font-medium hover:bg-gray-200"
                    >
                      Change to {p.role === 'admin' ? 'User' : 'Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}