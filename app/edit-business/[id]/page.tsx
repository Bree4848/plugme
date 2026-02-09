'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

// --- Success Toast ---
function SuccessToast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce">
      <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-green-400">
        <p className="font-bold">{message}</p>
      </div>
    </div>
  )
}

export default function EditBusinessPage() {
  const { id } = useParams()
  const router = useRouter()
  
  const [showToast, setShowToast] = useState(false)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  // Field names strictly matched to your Business Page
  const [form, setForm] = useState({
    name: '',
    description: '',
    contact_person: '',
    phone: '',
    email: '',
    image_url: ''
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // 1. Fetch Data (Matched to Business Page query)
  useEffect(() => {
    async function fetchBusiness() {
      if (!id) return
      
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single()

      if (data && !error) {
        setForm({
          name: data.name || '',
          description: data.description || '',
          contact_person: data.contact_person || '',
          phone: data.phone || '',
          email: data.email || '',
          image_url: data.image_url || ''
        })
        setImagePreview(data.image_url)
      }
      setLoading(false)
    }
    fetchBusiness()
  }, [id])

  // 2. Image Upload Logic
  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `business-uploads/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('business-images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('business-images')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  // 3. Update Function
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)

    try {
      let finalImageUrl = form.image_url

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile)
      }

      const { error } = await supabase
        .from('businesses')
        .update({
          name: form.name,
          description: form.description,
          contact_person: form.contact_person,
          phone: form.phone,
          email: form.email,
          image_url: finalImageUrl,
          // We keep status as 'approved' so it stays visible on the Business Page
          status: 'approved' 
        })
        .eq('id', id)

      if (error) throw error

      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      console.error("Update error:", err)
      alert("Failed to update. Check console.")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center dark:bg-[#0a0a0a] dark:text-white">
      <div className="animate-pulse">Loading Business Data...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-10 px-4 transition-colors">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#111111] rounded-3xl shadow-xl p-8 border dark:border-zinc-800">
        
        <h1 className="text-2xl font-bold mb-8 dark:text-white">Edit {form.name}</h1>
        
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-zinc-300">Business Photo</label>
            <div className="relative h-48 w-full rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 dark:border-zinc-800 flex items-center justify-center group">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <p className="text-white text-sm font-bold">Change Photo</p>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setImageFile(file)
                    setImagePreview(URL.createObjectURL(file))
                  }
                }}
              />
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold mb-1 dark:text-zinc-300">Business Name</label>
            <input 
              className="w-full p-3 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1 dark:text-zinc-300">Description</label>
            <textarea 
              rows={4}
              className="w-full p-3 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
            />
          </div>

          {/* Contact Information Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 dark:text-zinc-300">Contact Person</label>
              <input 
                className="w-full p-3 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                value={form.contact_person}
                onChange={(e) => setForm({...form, contact_person: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 dark:text-zinc-300">Phone</label>
              <input 
                className="w-full p-3 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 dark:text-zinc-300">Email Address</label>
            <input 
              type="email"
              className="w-full p-3 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="flex-1 py-3 rounded-xl border dark:border-zinc-700 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={updating}
              className="flex-[2] bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-700 disabled:opacity-50 transition-all"
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {showToast && <SuccessToast message="Business updated successfully!" />}
    </div>
  )
}