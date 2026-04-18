'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { WalletCard } from '@/components/WalletList'

interface Wallet {
  id: string
  address: string
  chain: string
  label: string | null
}

export default function WalletsPage() {
  const { data: session, status } = useSession()
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newWallet, setNewWallet] = useState({ address: '', chain: 'ethereum', label: '' })
  const [isLoading, setIsLoading] = useState(false)

  const fetchWallets = async () => {
    if (!session?.user?.id) return
    try {
      const res = await fetch('/api/wallets')
      if (res.ok) {
        const data = await res.json()
        setWallets(data)
      }
    } catch (err) {
      console.error('Failed to fetch wallets:', err)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchWallets()
    }
  }, [status, session])

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWallet),
      })

      if (res.ok) {
        setShowAddForm(false)
        setNewWallet({ address: '', chain: 'ethereum', label: '' })
        fetchWallets()
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to add wallet')
      }
    } catch (err) {
      console.error('Failed to add wallet:', err)
      alert('Failed to add wallet')
    }
    setIsLoading(false)
  }

  const handleDeleteWallet = async (id: string) => {
    try {
      await fetch(`/api/wallets/${id}`, { method: 'DELETE' })
      fetchWallets()
    } catch (err) {
      console.error('Failed to delete wallet:', err)
    }
  }

  if (status === 'loading') {
    return <div className="p-6 text-gray-400">Loading...</div>
  }

  if (!session) {
    return <div className="p-6 text-gray-400">Please log in to view wallets.</div>
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Wallets</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Wallet'}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <form onSubmit={handleAddWallet} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Wallet Address"
                value={newWallet.address}
                onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })}
                placeholder="0x... ou bc1..."
                required
              />
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Blockchain</label>
                <select
                  value={newWallet.chain}
                  onChange={(e) => setNewWallet({ ...newWallet, chain: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-light border border-muted rounded-lg text-white"
                >
                  <option value="ethereum">Ethereum</option>
                  <option value="bitcoin">Bitcoin</option>
                </select>
              </div>
            </div>
            <Input
              label="Label (optional)"
              value={newWallet.label}
              onChange={(e) => setNewWallet({ ...newWallet, label: e.target.value })}
              placeholder="My main wallet"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Wallet'}
            </Button>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {wallets.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-400">No wallets yet. Add your first wallet to start tracking!</p>
          </Card>
        ) : (
          wallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              {...wallet}
              onDelete={handleDeleteWallet}
            />
          ))
        )}
      </div>
    </div>
  )
}