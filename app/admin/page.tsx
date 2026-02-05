'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [businesses, setBusinesses] = useState<any[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)
const [message, setMessage] = useState<string | null>(null)

  async function updateStatus(id: string, status: string) {
  setActionLoading(id)
  setMessage(null)

  const { error } = await supabase
    .from('businesses')
    .update({ status })
    .eq('id', id)

  if (error) {
    setMessage('Something went wrong. Please try again.')
  } else {
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status } : b
      )
    )
    setMessage(`Business ${status} successfully.`)
  }

  setActionLoading(null)
}

async function deleteBusiness(id: string) {
  const confirmed = window.confirm(
    'Are you sure you want to permanently delete this business?'
  )

  if (!confirmed) return

  setActionLoading(id)
  setMessage(null)

  const { error } = await supabase
    .from('businesses')
    .delete()
    .eq('id', id)

  if (error) {
    setMessage('Failed to delete business.')
  } else {
    setBusinesses((prev) => prev.filter((b) => b.id !== id))
    setMessage('Business deleted successfully.')
  }

  setActionLoading(null)
}


  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push('/')
        return
      }

      setIsAdmin(true)

      const { data: businesses } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false })

      setBusinesses(businesses || [])
      setLoading(false)
    }

    checkAdmin()
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">
        Loading admin dashboard...
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage businesses and monitor platform activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Total Businesses</p>
          <p className="mt-2 text-2xl font-bold">
            {businesses.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Admins</p>
          <p className="mt-2 text-2xl font-bold">1</p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Platform Status</p>
          <p className="mt-2 text-sm font-semibold text-green-600">
            Active
          </p>
        </div>
      </div>
      {message && (
  <div className="rounded-lg border bg-green-50 px-4 py-3 text-sm text-green-700">
    {message}
  </div>
)}

      {/* Businesses Table */}
      <div className="rounded-xl border bg-white">
        <div className="border-b px-5 py-4">
          <h2 className="text-lg font-semibold">
            Registered Businesses
          </h2>
        </div>

        {/* Desktop / Tablet Table */}
<div className="hidden md:block overflow-x-auto">

          <table className="w-full text-sm">
  <thead className="bg-gray-50 text-left text-gray-600">
    <tr>
      <th className="px-5 py-3">Name</th>
      <th className="px-5 py-3">Category</th>
      <th className="px-5 py-3">Status</th>
      <th className="px-5 py-3">Actions</th>
    </tr>
  </thead>

  <tbody>
    {businesses.map((b) => (
      <tr key={b.id} className="border-t">
        <td className="px-5 py-3">{b.name}</td>
        <td className="px-5 py-3">{b.category}</td>
        <td className="px-5 py-3">{b.status}</td>
        <td className="px-5 py-3 space-x-2">
  {b.status !== 'approved' && (
    <button
      disabled={actionLoading === b.id}
      onClick={() => updateStatus(b.id, 'approved')}
      className="rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
    >
      {actionLoading === b.id ? '...' : 'Approve'}
    </button>
  )}

  {b.status !== 'rejected' && (
    <button
      disabled={actionLoading === b.id}
      onClick={() => updateStatus(b.id, 'rejected')}
      className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
    >
      {actionLoading === b.id ? '...' : 'Reject'}
    </button>
  )}

  {b.status !== 'approved' && (
    <button
  disabled={actionLoading === b.id}
  onClick={() => deleteBusiness(b.id)}
  className="rounded bg-gray-800 px-3 py-1 text-xs font-semibold text-white hover:bg-black disabled:opacity-50"
>
  {actionLoading === b.id ? '...' : 'Delete'}
</button>

)}

</td>

      </tr>
    ))}
  </tbody>
</table>
{/* Mobile Card View */}



        </div>
        <div className="space-y-4 md:hidden">
  {businesses.map((b) => (
    <div
      key={b.id}
      className="rounded-xl border bg-white p-4 space-y-3"
    >
      <div>
        <p className="text-xs text-gray-500">Business</p>
        <p className="font-semibold">{b.name}</p>
      </div>

      <div className="flex justify-between">
        <span className="text-sm text-gray-600">
          {b.category}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            b.status === 'approved'
              ? 'bg-green-100 text-green-700'
              : b.status === 'rejected'
              ? 'bg-red-100 text-red-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {b.status}
        </span>
      </div>

      <div className="flex gap-2 pt-2">
        {b.status !== 'approved' && (
          <button
            disabled={actionLoading === b.id}
            onClick={() => updateStatus(b.id, 'approved')}
            className="flex-1 rounded bg-green-600 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            Approve
          </button>
        )}

        {b.status !== 'rejected' && (
          <button
            disabled={actionLoading === b.id}
            onClick={() => updateStatus(b.id, 'rejected')}
            className="flex-1 rounded bg-red-600 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            Reject
          </button>
        )}

        <button
          disabled={actionLoading === b.id}
          onClick={() => deleteBusiness(b.id)}
          className="flex-1 rounded bg-gray-800 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  ))}

  {businesses.length === 0 && (
    <p className="text-center text-sm text-gray-500">
      No businesses found
    </p>
  )}
</div>
      </div>
    </div>
  )
}
