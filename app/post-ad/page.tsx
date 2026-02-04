'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function PostAdPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    contactPerson: '',
    phone: '',
    email: '',
  })

  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
        setForm(f => ({ ...f, email: data.user.email ?? '' }))
      }
    })
  }, [router])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let imageUrl = null

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('ads')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('ads')
          .getPublicUrl(fileName)

        imageUrl = data.publicUrl
      }

      const { error: insertError } = await supabase
        .from('ads')
        .insert([
          {
            user_id: user.id,
            title: form.title,
            description: form.description,
            contact_person: form.contactPerson,
            phone: form.phone,
            email: form.email,
            image_url: imageUrl,
            status: 'pending',
          },
        ])

      if (insertError) throw insertError

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className="min-h-screen bg-gray-100 px-4 py-8">
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center">
          Post an Ad
        </h1>
        <p className="text-gray-600 text-center mt-1">
          Create a paid advert for your business
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Ad Title
            </label>
            <input
              name="title"
              required
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              required
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">
                Contact Person
              </label>
              <input
                name="contactPerson"
                required
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone
              </label>
              <input
                name="phone"
                required
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Ad Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={e =>
                setImageFile(e.target.files?.[0] ?? null)
              }
              className="w-full"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Continue to Payment'}
          </button>
        </form>
      </div>
    </div>
  </div>
)
}