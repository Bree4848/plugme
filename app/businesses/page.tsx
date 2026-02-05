'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

type Business = {
  id: string
  name: string
  category: string
  description: string
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState('')


  useEffect(() => {
    fetchBusinesses()
  }, [])

  async function fetchBusinesses(
  nameQuery = '',
  locationQuery = ''
) {
  setLoading(true)

  let query = supabase
    .from('businesses')
    .select('*')
    .eq('status', 'approved')
    .order('name')

  if (nameQuery) {
    query = query.ilike('name', `%${nameQuery}%`)
  }

  if (locationQuery) {
    query = query.ilike('location', `%${locationQuery}%`)
  }

  const { data } = await query

  setBusinesses(data || [])
  setLoading(false)
}


  function handleSearch(e: React.FormEvent) {
  e.preventDefault()
  fetchBusinesses(search, location)
}


  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Businesses</h1>

      {/* Search bar */}
      <form
  onSubmit={handleSearch}
  className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl"
>
  <input
    type="text"
    placeholder="Search business name…"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
  />

  <input
    type="text"
    placeholder="Location (city or area)…"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
  />

  <button
    type="submit"
    className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
  >
    Search
  </button>
</form>


      {/* Results */}
      {loading ? (
        <p className="text-gray-500">Loading businesses…</p>
      ) : businesses.length === 0 ? (
        <p className="text-gray-500">No businesses found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((b) => (
            <div
              key={b.id}
              className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold mb-1">
                {b.name}
              </h3>

              <p className="text-sm text-gray-600 mb-2">
                {b.category}
              </p>

              <p className="text-sm text-gray-700 line-clamp-3">
                {b.description}
              </p>

              <Link
                href={`/businesses/${b.id}`}
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                View Business →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
