'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

// --- STEP 1: THE TOAST COMPONENT (Outside the main function) ---
function SuccessToast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce">
      <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-green-400">
        <div className="bg-white text-green-600 rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="font-bold">{message}</p>
      </div>
    </div>
  )
}

export default function EditBusinessPage() {
  const { id } = useParams()
  const router = useRouter()
  
  // --- STEP 2: THE STATE (Inside the main function) ---
  const [showToast, setShowToast] = useState(false)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [form, setForm] = useState({ business_name: '', category: '', description: '', location: '', phone: '', email: '' })

  // (Data fetching useEffect would go here...)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)

    const { error } = await supabase
      .from('businesses')
      .update({ /* your form data */ })
      .eq('id', id)

    setUpdating(false)

    // --- STEP 3: THE LOGIC (Inside the success block) ---
    if (!error) {
      setShowToast(true) // Start the animation
      
      setTimeout(() => {
        setShowToast(false)
        router.push('/dashboard') // Move user back to dashboard
      }, 3000)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Business</h1>
      
      <form onSubmit={handleUpdate} className="space-y-4">
        {/* ... All your input fields go here ... */}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {updating ? 'Saving...' : 'Update Business'}
        </button>
      </form>

      {/* --- STEP 4: THE UI TRIGGER (Just before the final closing div) --- */}
      {showToast && <SuccessToast message="Business updated successfully!" />}
    </div>
  )
}