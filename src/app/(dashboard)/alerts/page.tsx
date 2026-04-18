'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Bell, Trash2, ToggleLeft, ToggleRight, Mail, MessageCircle, Edit2 } from 'lucide-react'

interface AlertRule {
  id: string
  type: string
  channel: string
  threshold: string | null
  thresholdType: string
  isActive: boolean
  wallet: { id: string; label: string; address: string }
}

interface Wallet {
  id: string
  label: string
  address: string
}

export default function AlertsPage() {
  const { data: session } = useSession()
  const [alerts, setAlerts] = useState<AlertRule[]>([])
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    walletId: '',
    type: 'both',
    channel: 'whatsapp',
    threshold: '',
    thresholdType: 'eth',
  })

  useEffect(() => {
    fetchAlerts()
    fetchWallets()
  }, [])

  const fetchWallets = async () => {
    const res = await fetch('/api/wallets')
    if (res.ok) setWallets(await res.json())
  }

  const fetchAlerts = async () => {
    const res = await fetch('/api/alerts')
    if (res.ok) setAlerts(await res.json())
  }

  const resetForm = () => {
    setFormData({
      walletId: '',
      type: 'both',
      channel: 'whatsapp',
      threshold: '',
      thresholdType: 'eth',
    })
    setShowForm(false)
    setEditingId(null)
  }

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    resetForm()
    fetchAlerts()
  }

  const handleUpdateAlert = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    
    await fetch(`/api/alerts/${editingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletId: formData.walletId,
        type: formData.type,
        channel: formData.channel,
        threshold: formData.threshold || null,
        thresholdType: formData.thresholdType,
      }),
    })
    resetForm()
    fetchAlerts()
  }

  const toggleAlert = async (id: string, isActive: boolean) => {
    await fetch(`/api/alerts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })
    fetchAlerts()
  }

  const deleteAlert = async (id: string) => {
    await fetch(`/api/alerts/${id}`, { method: 'DELETE' })
    fetchAlerts()
  }

  const startEdit = (alert: AlertRule) => {
    setEditingId(alert.id)
    setFormData({
      walletId: alert.wallet.id,
      type: alert.type,
      channel: alert.channel,
      threshold: alert.threshold || '',
      thresholdType: alert.thresholdType || 'eth',
    })
    setShowForm(true)
  }

  const getChannelIcon = (channel: string) => {
    if (channel === 'whatsapp') return <MessageCircle size={16} className="text-green-400" />
    return <Mail size={16} className="text-primary" />
  }

  const getChannelLabel = (channel: string) => {
    switch (channel) {
      case 'email': return 'Email'
      case 'whatsapp': return 'WhatsApp'
      case 'both': return 'Email + WhatsApp'
      default: return channel
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Alerts</h1>
        <Button onClick={() => { if(showForm) resetForm(); else setShowForm(true); }}>
          {showForm ? 'Cancel' : 'Create Alert'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Alert' : 'Create New Alert'}
          </h2>
          <form onSubmit={editingId ? handleUpdateAlert : handleCreateAlert} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Wallet</label>
                <select
                  value={formData.walletId}
                  onChange={(e) => setFormData({ ...formData, walletId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-light border border-muted rounded-lg text-white"
                  required
                >
                  <option value="">Select wallet</option>
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>{w.label || w.address}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-light border border-muted rounded-lg text-white"
                >
                  <option value="both">Both (In & Out)</option>
                  <option value="in">Received (In)</option>
                  <option value="out">Sent (Out)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Notification Channel</label>
                <select
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-light border border-muted rounded-lg text-white"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="both">Both (WhatsApp + Email)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Min Amount"
                  type="number"
                  step="0.0001"
                  value={formData.threshold}
                  onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                  placeholder="0.01"
                />
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Unit</label>
                  <select
                    value={formData.thresholdType}
                    onChange={(e) => setFormData({ ...formData, thresholdType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-dark-light border border-muted rounded-lg text-white"
                  >
                    <option value="eth">ETH</option>
                    <option value="btc">BTC</option>
                    <option value="usd">USD</option>
                  </select>
                </div>
              </div>
            </div>
            <Button type="submit">{editingId ? 'Save Changes' : 'Create Alert'}</Button>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-400">No alerts configured. Create one to get notified!</p>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Bell size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">{alert.wallet.label || 'Wallet Alert'}</p>
                  <p className="text-sm text-gray-400">
                    {alert.type === 'both' ? 'Any transaction' : alert.type === 'in' ? 'Received' : 'Sent'}
                    {' via '}
                    {getChannelIcon(alert.channel)}
                    <span className="ml-1">{getChannelLabel(alert.channel)}</span>
                    {alert.threshold && ` (min ${alert.threshold} ${alert.thresholdType})`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(alert)} title="Edit">
                  <Edit2 size={18} className="text-primary hover:text-white" />
                </button>
                <button onClick={() => toggleAlert(alert.id, alert.isActive)} title="Toggle">
                  {alert.isActive ? (
                    <ToggleRight size={24} className="text-accent" />
                  ) : (
                    <ToggleLeft size={24} className="text-gray-500" />
                  )}
                </button>
                <button onClick={() => deleteAlert(alert.id)} title="Delete">
                  <Trash2 size={20} className="text-warning hover:text-red-400" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}