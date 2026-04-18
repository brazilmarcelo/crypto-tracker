'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Bell, Check } from 'lucide-react'

interface Notification {
  id: string
  message: string
  channel: string
  isRead: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true
    return !n.isRead
  })

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === 'all' ? 'bg-primary text-white' : 'bg-dark-light text-gray-400'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === 'unread' ? 'bg-primary text-white' : 'bg-dark-light text-gray-400'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-400">No notifications yet.</p>
          </Card>
        ) : (
          filtered.map((notif) => (
            <Card
              key={notif.id}
              className={`flex items-center justify-between ${!notif.isRead ? 'border-l-4 border-l-primary' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Bell size={20} className="text-primary" />
                </div>
                <div>
                  <p className={notif.isRead ? 'text-gray-400' : 'text-white'}>
                    {notif.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {!notif.isRead && (
                  <button onClick={() => markAsRead(notif.id)} className="p-2 hover:bg-white/5 rounded-lg">
                    <Check size={18} className="text-accent" />
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}