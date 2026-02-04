'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function PostBusinessPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    contact_person: '',
    phone: '',
    email: '',
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in to post a business.')
      setLoading(false)
      return
    }

    let imageUrl: string | null = null

    // ⬆️ Upload image
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

    // ⬆️ Insert business
    const { error: insertError } = await supabase
      .from('businesses')
      .insert({
        user_id: user.id,
        name: form.name,
        description: form.description,
        contact_person: form.contact_person,
        phone: form.phone,
        email: form.email,
        image_url: imageUrl,
        status: 'pending',
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 md:p-8">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Post Your Business
          </h1>
          <p className="text-gray-600 mt-2">
            Promote your business on PlugMe
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Business Name */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Business Name"
            className="w-full rounded-lg border px-4 py-2"
          />

          {/* Description */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Describe your business"
            className="w-full rounded-lg border px-4 py-2"
          />

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="contact_person"
              value={form.contact_person}
              onChange={handleChange}
              required
              placeholder="Contact Person"
              className="rounded-lg border px-4 py-2"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="Phone Number"
              className="rounded-lg border px-4 py-2"
            />
          </div>

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email Address"
            className="w-full rounded-lg border px-4 py-2"
          />

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Business Image
            </label>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mb-3 h-40 w-full object-cover rounded-lg border"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Business'}
          </button>
        </form>
      </div>
    </div>
  )
}
