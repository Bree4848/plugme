'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
      })

    if (error) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="mt-3 text-gray-600">
    If you have a question or would like to help us improve,
    please send us a message.
  </p>

      {submitted ? (
        <div className="rounded-lg border bg-green-50 p-4 text-green-700">
          Thank you for reaching out. We’ll get back to you soon.
        </div>
      ) : (

        
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          {error && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              name="name"
              required
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Message
            </label>
            <textarea
              name="message"
              required
              rows={4}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <button
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  )
}
