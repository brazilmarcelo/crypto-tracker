'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { User, Lock, Bell, Shield, Phone, Loader2, CheckCircle, Mail } from 'lucide-react'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [phone, setPhone] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [emailNotif, setEmailNotif] = useState(true)
  const [whatsappNotif, setWhatsappNotif] = useState(true)
  const [privacyMode, setPrivacyMode] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    const res = await fetch('/api/user/profile')
    if (res.ok) {
      const data = await res.json()
      setPhone(data.phone || '')
    }
  }

  const handleSavePhone = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/user/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      if (res.ok) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch (err) {
      console.error('Failed to save phone:', err)
    }
    setIsSaving(false)
  }

  const handleSavePreferences = async () => {
    await fetch('/api/user/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailNotif,
        whatsappNotif,
        privacyMode,
      }),
    })
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <User size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>
          <div className="space-y-4">
            <Input
              label="Name"
              defaultValue={session?.user?.name || ''}
              placeholder="Your name"
            />
            <Input
              label="Email"
              defaultValue={session?.user?.email || ''}
              disabled
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Phone size={20} className="text-green-400" />
            <h2 className="text-lg font-semibold">WhatsApp Number</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Add your WhatsApp number to receive transaction alerts. Use format: +55 (11) 99999-9999
          </p>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+55 11 99999-9999"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSavePhone} 
                disabled={isSaving}
                className="whitespace-nowrap"
              >
                {isSaving ? (
                  <Loader2 size={16} className="animate-spin mr-2" />
                ) : saveSuccess ? (
                  <CheckCircle size={16} className="mr-2" />
                ) : null}
                {saveSuccess ? 'Saved!' : 'Save Phone'}
              </Button>
            </div>
          </div>
          {saveSuccess && (
            <p className="text-accent text-sm mt-2">Phone number saved successfully!</p>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Bell size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Notification Preferences</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-dark rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-primary" />
                <span>Email notifications</span>
              </div>
              <input 
                type="checkbox" 
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.target.checked)}
                className="w-5 h-5 accent-primary" 
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-dark rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-green-400" />
                <span>WhatsApp notifications</span>
              </div>
              <input 
                type="checkbox" 
                checked={whatsappNotif}
                onChange={(e) => setWhatsappNotif(e.target.checked)}
                className="w-5 h-5 accent-primary" 
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-dark rounded-lg cursor-pointer">
              <span>Hide values (privacy mode)</span>
              <input 
                type="checkbox" 
                checked={privacyMode}
                onChange={(e) => setPrivacyMode(e.target.checked)}
                className="w-5 h-5 accent-primary" 
              />
            </label>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Lock size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-dark rounded-lg">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-gray-400" />
                <span>Two-Factor Authentication</span>
              </div>
              <Button variant="secondary" size="sm">Enable</Button>
            </div>
            <Button variant="secondary">Change Password</Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4 text-warning">Danger Zone</h2>
          <Button
            variant="secondary"
            className="border-warning text-warning hover:bg-warning/20"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Sign Out
          </Button>
        </Card>
      </div>
    </div>
  )
}