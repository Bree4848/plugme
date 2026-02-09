'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Message = {
  id: string
  name: string
  email: string
  message: string
  created_at: string
  is_read: boolean
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setMessages(data)
    }
    setLoading(false)
  }

  async function markAsRead(id: string, currentStatus: boolean) {
    if (currentStatus) return

    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id)

    if (!error) {
      setMessages(prev => 
        prev.map(m => m.id === id ? { ...m, is_read: true } : m)
      )
    }
  }

  // --- New: Delete Function ---
  async function deleteMessage(id: string) {
    if (!confirm('Are you sure you want to delete this message?')) return

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)

    if (error) {
      alert("Error deleting: " + error.message)
    } else {
      setMessages(prev => prev.filter(m => m.id !== id))
    }
  }

  if (loading) return <div className="p-6 text-gray-500 text-center">Loading messages…</div>

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Inbox</h1>

      <div className="hidden md:block overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left border-b">
            <tr>
              <th className="px-5 py-3 w-10"></th>
              <th className="px-5 py-3">From</th>
              <th className="px-5 py-3">Message</th>
              <th className="px-5 py-3">Received</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {messages.map((m) => (
              <tr 
                key={m.id} 
                onMouseEnter={() => markAsRead(m.id, m.is_read)}
                className={`transition-colors ${!m.is_read ? 'bg-blue-50/40' : 'hover:bg-gray-50'}`}
              >
                <td className="px-5 py-4">
                  {!m.is_read && <div className="h-2 w-2 rounded-full bg-blue-600" title="Unread"></div>}
                </td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-900">{m.name}</div>
                  <div className="text-xs text-blue-600 truncate max-w-[150px]">{m.email}</div>
                </td>
                <td className="px-5 py-4 max-w-md text-gray-700 italic">
                  "{m.message}"
                </td>
                <td className="px-5 py-4 text-xs text-gray-400">
                  {new Date(m.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 text-right">
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteMessage(m.id); }}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            onClick={() => markAsRead(m.id, m.is_read)}
            className={`rounded-xl border p-4 space-y-3 relative ${!m.is_read ? 'border-blue-200 bg-blue-50' : 'bg-white'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-gray-900">{m.name}</div>
                <div className="text-xs text-blue-600">{m.email}</div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteMessage(m.id); }}
                className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
            <p className="text-sm text-gray-700 bg-white/50 p-2 rounded border border-gray-100 italic">
              {m.message}
            </p>
            <div className="text-[10px] text-gray-400">
              {new Date(m.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}