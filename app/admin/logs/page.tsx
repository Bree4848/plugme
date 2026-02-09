'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type AuditLog = {
  id: string
  action: string
  target_type: string
  target_id: string | null
  created_at: string
  admin: {
    email: string
  } | null
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select(`
        id,
        action,
        target_type,
        target_id,
        created_at,
        admin:admin_id ( email )
      `)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setLogs(data as any[])
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading audit logs…
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Audit Logs</h1>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-5 py-3">Admin</th>
              <th className="px-5 py-3">Action</th>
              <th className="px-5 py-3">Target</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="px-5 py-3">
                  {log.admin?.email || 'Unknown'}
                </td>

                <td className="px-5 py-3 font-medium">
                  {log.action}
                </td>

                <td className="px-5 py-3 text-xs text-gray-600">
                  {log.target_type}
                  {log.target_id && (
                    <span className="block text-gray-400">
                      {log.target_id}
                    </span>
                  )}
                </td>

                <td className="px-5 py-3 text-xs text-gray-500">
                  {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))}

            {logs.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-6 text-center text-gray-500"
                >
                  No audit logs yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {logs.map((log) => (
          <div
            key={log.id}
            className="rounded-xl border bg-white p-4 space-y-2"
          >
            <div className="text-sm font-semibold">
              {log.action}
            </div>

            <div className="text-xs text-gray-600">
              Admin: {log.admin?.email || 'Unknown'}
            </div>

            <div className="text-xs text-gray-500">
              {log.target_type}
            </div>

            <div className="text-xs text-gray-400">
              {new Date(log.created_at).toLocaleString()}
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <p className="text-center text-sm text-gray-500">
            No audit logs yet
          </p>
        )}
      </div>
    </div>
  )
}
