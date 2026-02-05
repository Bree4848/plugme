'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function PostBusinessPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    contact_person: '',
    phone: '',
    email: '',
  })

  const [imageFile, setImageFile] = useState<File | null>(null)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in')
      setLoading(false)
      return
    }

    let imageUrl = null

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('business-images')
        .upload(fileName, imageFile)

      if (uploadError) {
        setError(uploadError.message)
        setLoading(false)
        return
      }

      const { data } = supabase.storage
        .from('business-images')
        .getPublicUrl(fileName)

      imageUrl = data.publicUrl
    }

    const { error: insertError } = await supabase
      .from('businesses')
      .insert({
        ...form,
        image_url: imageUrl,
        user_id: user.id,
      })

    if (insertError) {
      setError(insertError.message)
    } else {
      setSuccess(true)
      setForm({
        name: '',
        category: '',
        description: '',
        contact_person: '',
        phone: '',
        email: '',
      })
      setImageFile(null)
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
    }

    setLoading(false)
  }

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 border shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Post a Business
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Add your business to the PlugMe directory
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-600">
              Business posted successfully! ✓
            </div>
          )}

          {/* Business Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business name
            </label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              required
              value={form.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Contact Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact person
              </label>
              <input
                name="contact_person"
                required
                value={form.contact_person}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone number
              </label>
              <input
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business image
            </label>
            <input
              type="file"
              accept="image/*"
              value={imageFile ? undefined : ''}
              onChange={(e) =>
                setImageFile(e.target.files?.[0] ?? null)
              }
              className="mt-1 block w-full text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Posting...' : 'Post Business'}
          </button>
        </form>
      </div>
    </div>
  )
}
