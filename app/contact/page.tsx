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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      {/* Responsive width: max-w-md on mobile, max-w-2xl on desktop */}
      <div className="w-full max-w-md md:max-w-2xl rounded-xl bg-white p-6 md:p-10 shadow-sm border">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Contact Us
        </h1>
        <p className="mt-2 text-sm md:text-base text-gray-600">
          If you have a question or would like to help us improve, please send us a message.
        </p>

        <div className="mt-8">
          {submitted ? (
            <div className="rounded-lg border bg-green-50 p-6 text-center text-green-700">
              <p className="font-semibold text-lg">Message Sent!</p>
              <p className="text-sm">Thank you for reaching out. We’ll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    name="name"
                    required
                    placeholder="Your name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="How can we help?"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none resize-none transition-all"
                />
              </div>

              <div className="flex justify-end">
                <button
                  disabled={loading}
                  className="w-full md:w-auto md:px-10 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-all shadow-md active:scale-95"
                >
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}