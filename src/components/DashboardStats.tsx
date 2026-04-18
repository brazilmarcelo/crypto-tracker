'use client'

import { Card } from '@/components/ui/Card'
import { Wallet, Bell, TrendingUp } from 'lucide-react'

interface DashboardStatsProps {
  totalWallets: number
  recentAlerts: number
  lastActivity: string | null
}

export function DashboardStats({ totalWallets, recentAlerts, lastActivity }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="flex items-center gap-4">
        <div className="p-3 bg-primary/20 rounded-lg">
          <Wallet className="text-primary" size={24} />
        </div>
        <div>
          <p className="text-gray-400 text-sm">Total Wallets</p>
          <p className="text-2xl font-bold">{totalWallets}</p>
        </div>
      </Card>

      <Card className="flex items-center gap-4">
        <div className="p-3 bg-accent/20 rounded-lg">
          <Bell className="text-accent" size={24} />
        </div>
        <div>
          <p className="text-gray-400 text-sm">Recent Alerts</p>
          <p className="text-2xl font-bold">{recentAlerts}</p>
        </div>
      </Card>

      <Card className="flex items-center gap-4">
        <div className="p-3 bg-warning/20 rounded-lg">
          <TrendingUp className="text-warning" size={24} />
        </div>
        <div>
          <p className="text-gray-400 text-sm">Last Activity</p>
          <p className="text-lg font-medium">{lastActivity || 'No activity'}</p>
        </div>
      </Card>
    </div>
  )
}