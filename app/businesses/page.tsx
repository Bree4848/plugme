'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

type Business = {
  id: string
  name: string
  category: string
  description: string
  location?: string // Added location to type if it exists in your D8
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(true)

  // 1. Fixed fetchBusinesses to accept search arguments
  const fetchBusinesses = useCallback(async (nameQuery = '', locationQuery = '') => {
    setLoading(true)
    
    try {
      let query = supabase
        .from('businesses')
        .select('*')
        .eq('status', 'approved')
        .order('name')

      // Apply search filters only if text is provided
      if (nameQuery.trim()) {
        query = query.ilike('name', `%${nameQuery}%`)
      }

      if (locationQuery.trim()) {
        // Only run this if your table has a 'location' column
        query = query.ilike('location', `%${locationQuery}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error("Supabase error:", error.message)
        setBusinesses([])
      } else {
        setBusinesses(data || [])
      }
    } catch (err) {
      console.error("Unexpected error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // 2. Initial load
  useEffect(() => {
    fetchBusinesses()
  }, [fetchBusinesses])

  // 3. Handle search form submission
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
          className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none text-black"
        />

        <input
          type="text"
          placeholder="Location (city or area)…"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none text-black"
        />

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Results */}
      <div className="mt-8">
        {loading ? (
          <p className="text-gray-500">Loading businesses…</p>
        ) : businesses.length === 0 ? (
          <div className="text-center py-10 border rounded-xl bg-gray-50">
            <p className="text-gray-500 font-medium">No approved businesses found.</p>
            <p className="text-sm text-gray-400">Try adjusting your search or checking the database status.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition group"
              >
                <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                  {b.name}
                </h3>

                <p className="text-sm text-gray-600 mb-2">
                  {b.category}
                </p>

                <p className="text-sm text-gray-700 line-clamp-3">
                  {b.description}
                </p>

                <Link
                  href={`/business/${b.id}`}
                  className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
                >
                  View Business →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}