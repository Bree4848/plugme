'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

export default function PostAdPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return alert('Select an image or video')

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert('Not logged in')

    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`


    const { error: uploadError } = await supabase.storage
      .from('ads')
      .upload(path, file)

    if (uploadError) {
      setLoading(false)
      return alert(uploadError.message)
    }

    const { data } = supabase.storage.from('ads').getPublicUrl(path)

    const mediaType =
      file.type.startsWith('video') ? 'video' : 'image'

    const { error } = await supabase.from('ads').insert({
      user_id: user.id,
      title,
      media_url: data.publicUrl,
      media_type: mediaType,
    })

    setLoading(false)

    if (error) alert(error.message)
    else router.push('/')
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Post an Ad</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Ad title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="file"
          accept="image/*,video/mp4"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full"
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          {loading ? 'Uploading...' : 'Post Ad'}
        </button>
      </form>
    </div>
  )
}
