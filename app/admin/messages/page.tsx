'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Message = {
  id: string
  name: string
  email: string
  message: string
  created_at: string
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

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading messages…
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Contact Messages</h1>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Message</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {messages.map((m) => (
              <tr key={m.id} className="border-t align-top">
                <td className="px-5 py-3 font-medium">
                  {m.name}
                </td>
                <td className="px-5 py-3 text-blue-600">
                  <a href={`mailto:${m.email}`}>
                    {m.email}
                  </a>
                </td>
                <td className="px-5 py-3 max-w-md">
                  {m.message}
                </td>
                <td className="px-5 py-3 text-xs text-gray-500">
                  {new Date(m.created_at).toLocaleString()}
                </td>
              </tr>
            ))}

            {messages.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-6 text-center text-gray-500"
                >
                  No messages yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {messages.map((m) => (
          <div
            key={m.id}
            className="rounded-xl border bg-white p-4 space-y-2"
          >
            <div className="font-semibold">{m.name}</div>

            <a
              href={`mailto:${m.email}`}
              className="text-sm text-blue-600"
            >
              {m.email}
            </a>

            <p className="text-sm text-gray-700">
              {m.message}
            </p>

            <p className="text-xs text-gray-500 pt-1">
              {new Date(m.created_at).toLocaleString()}
            </p>
          </div>
        ))}

        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-500">
            No messages yet
          </p>
        )}
      </div>
    </div>
  )
}
