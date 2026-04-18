'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { DashboardStats } from '@/components/DashboardStats'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Plus, ArrowRight, Wallet, TrendingUp, Bell, Settings, Activity, Clock } from 'lucide-react'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [wallets, setWallets] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [walletsRes, alertsRes, txsRes] = await Promise.all([
          fetch('/api/wallets'),
          fetch('/api/alerts'),
          fetch('/api/transactions/all')
        ])
        
        if (walletsRes.ok) {
          setWallets(await walletsRes.json())
        }
        if (alertsRes.ok) {
          const a = await alertsRes.json()
          setAlerts(a.filter((alert: any) => alert.isActive))
        }
        if (txsRes.ok) {
          setTransactions(await txsRes.json())
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
      }
      setIsLoading(false)
    }
    
    if (session) {
      fetchData()
    }
  }, [session])

  const recentTxs = transactions.slice(0, 5)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome back! Here's your crypto overview.</p>
        </div>
        <Link href="/wallets">
          <Button>
            <Plus size={18} className="mr-2" />
            Add Wallet
          </Button>
        </Link>
      </div>

      <DashboardStats 
        totalWallets={wallets.length} 
        recentAlerts={alerts.length}
        lastActivity={transactions.length > 0 ? transactions[0].timestamp : null}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Wallet size={20} className="text-primary" />
                Your Wallets
              </h2>
              <Link href="/wallets" className="text-sm text-primary hover:underline">
                View all →
              </Link>
            </div>
            {wallets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No wallets yet</p>
                <Link href="/wallets">
                  <Button size="sm">Add Your First Wallet</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {wallets.slice(0, 4).map((w: any) => (
                  <Link key={w.id} href={`/wallets/${w.id}`} className="block">
                    <div className="flex items-center justify-between p-4 bg-dark rounded-lg hover:bg-white/5 transition-all hover:scale-[1.01] border border-transparent hover:border-primary/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <Wallet size={18} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{w.label || 'Unnamed Wallet'}</p>
                          <p className="text-xs text-gray-400 font-mono">{w.address.slice(0, 10)}...{w.address.slice(-4)}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full capitalize">
                        {w.chain}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {recentTxs.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Activity size={20} className="text-accent" />
                  Recent Transactions
                </h2>
              </div>
              <div className="space-y-3">
                {recentTxs.map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-dark rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${tx.type === 'in' ? 'bg-accent/20' : 'bg-warning/20'}`}>
                        {tx.type === 'in' ? (
                          <TrendingUp size={16} className="text-accent" />
                        ) : (
                          <TrendingUp size={16} className="text-warning rotate-180" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">{tx.type === 'in' ? 'Received' : 'Sent'}</p>
                        <p className="text-xs text-gray-400 font-mono">{tx.hash.slice(0, 10)}...</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono ${tx.type === 'in' ? 'text-accent' : 'text-warning'}`}>
                        {tx.type === 'in' ? '+' : '-'}{parseFloat(tx.value).toFixed(4)} {tx.token}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Bell size={20} className="text-primary" />
              Active Alerts
            </h2>
            {alerts.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No alerts configured</p>
            ) : (
              <div className="space-y-2">
                {alerts.slice(0, 4).map((alert: any) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-dark rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{alert.wallet.label || 'Wallet Alert'}</p>
                      <p className="text-xs text-gray-400">{alert.type === 'both' ? 'Any transaction' : alert.type}</p>
                    </div>
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                  </div>
                ))}
              </div>
            )}
            <Link href="/alerts" className="block mt-4">
              <Button variant="secondary" size="sm" className="w-full">
                Manage Alerts
              </Button>
            </Link>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Settings size={20} className="text-primary" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link href="/wallets" className="block">
                <div className="flex items-center justify-between p-3 bg-dark rounded-lg hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-2">
                    <Plus size={16} className="text-primary" />
                    <span>Add Wallet</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </Link>
              <Link href="/alerts" className="block">
                <div className="flex items-center justify-between p-3 bg-dark rounded-lg hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-primary" />
                    <span>Create Alert</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </Link>
              <Link href="/settings" className="block">
                <div className="flex items-center justify-between p-3 bg-dark rounded-lg hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-2">
                    <Settings size={16} className="text-primary" />
                    <span>Settings</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}