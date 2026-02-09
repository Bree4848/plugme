'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Profile = {
  id: string
  email: string
  role: string
  created_at: string
}

export default function AdminUserManager() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [searchQuery, setSearchQuery] = useState('') // New search state
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchProfiles()
  }, [])

  async function fetchProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setProfiles(data || [])
    setLoading(false)
  }

  async function toggleRole(userId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    
    if (currentRole === 'admin' && !window.confirm("Are you sure you want to remove admin rights?")) {
      return
    }

    setUpdating(userId)
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (!error) {
      setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: newRole } : p))
    }
    setUpdating(null)
  }

  // Filter logic: narrows down profiles based on email
  const filteredProfiles = profiles.filter(profile => 
    profile.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return <div className="text-sm text-gray-500 p-4">Loading users...</div>

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search users by email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="px-5 py-3 text-xs uppercase tracking-wider text-gray-400">User Email</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider text-gray-400">Current Role</th>
                <th className="px-5 py-3 text-right text-xs uppercase tracking-wider text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {profile.email}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        profile.role === 'admin' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {profile.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        disabled={updating === profile.id}
                        onClick={() => toggleRole(profile.id, profile.role)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${
                          profile.role === 'admin' 
                            ? 'border-red-200 text-red-600 hover:bg-red-50' 
                            : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                        } disabled:opacity-50`}
                      >
                        {updating === profile.id ? 'Saving...' : profile.role === 'admin' ? 'Demote' : 'Promote'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-gray-500 italic">
                    No users found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}