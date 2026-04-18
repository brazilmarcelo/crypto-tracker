'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TransactionRow, TransactionModal } from '@/components/TransactionList'
import { Copy, ExternalLink, Download, Loader2, RefreshCw, TrendingUp, TrendingDown, Activity, Wallet, Clock } from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface Transaction {
  id: string
  hash: string
  type: 'in' | 'out'
  value: string
  token: string
  timestamp: string
  fromAddress?: string
  toAddress?: string
  fee?: string
  blockNumber?: string
  gasUsed?: string
  gasPrice?: string
  nonce?: string
  transactionIndex?: string
  input?: string
}

interface Wallet {
  id: string
  address: string
  chain: string
  label: string | null
  createdAt: string
}

interface WalletDetails {
  wallet: Wallet
  balance: string
  stats: {
    totalReceived: string
    totalSent: string
    transactionCount: number
    firstTransaction: string | null
    lastTransaction: string | null
  }
  transactions: Transaction[]
  monthlyData: Array<{
    month: string
    received: number
    sent: number
  }>
}

export default function WalletDetailPage() {
  const params = useParams()
  const [details, setDetails] = useState<WalletDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all')
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  const fetchData = async (refresh = false) => {
    if (!params.id) return
    setIsLoading(true)
    if (refresh) setIsRefreshing(true)
    
    try {
      const res = await fetch(`/api/wallets/${params.id}/details${refresh ? '?refresh=true' : ''}`)
      if (res.ok) {
        const data = await res.json()
        setDetails(data)
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
    }
    
    setIsLoading(false)
    setIsRefreshing(false)
  }

  useEffect(() => {
    fetchData()
  }, [params.id])

  const handleRefresh = () => {
    fetchData(true)
  }

  const filteredTxs = details?.transactions.filter((tx) => {
    if (filter === 'all') return true
    return tx.type === filter
  }) || []

  const explorerUrl = details?.wallet?.chain === 'ethereum' 
    ? `https://etherscan.io/address/${details?.wallet?.address}`
    : `https://blockchain.info/address/${details?.wallet?.address}`

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin" size={32} />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/wallets" className="text-primary text-sm hover:underline mb-2 inline-block">
              ← Back to Wallets
            </Link>
            <h1 className="text-2xl font-bold">{details?.wallet?.label || 'Wallet'}</h1>
            <p className="text-gray-400 font-mono text-sm">{details?.wallet?.address}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin mr-2' : 'mr-2'} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Wallet className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Balance</p>
              <p className="text-xl font-bold">
                {details?.balance}
                <span className="text-sm text-gray-400 ml-1">
                  {details?.wallet?.chain === 'ethereum' ? 'ETH' : 'BTC'}
                </span>
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Received</p>
              <p className="text-xl font-bold">
                {details?.stats.totalReceived}
                <span className="text-sm text-gray-400 ml-1">
                  {details?.wallet?.chain === 'ethereum' ? 'ETH' : 'BTC'}
                </span>
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <TrendingDown className="text-red-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Sent</p>
              <p className="text-xl font-bold">
                {details?.stats.totalSent}
                <span className="text-sm text-gray-400 ml-1">
                  {details?.wallet?.chain === 'ethereum' ? 'ETH' : 'BTC'}
                </span>
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Activity className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Transactions</p>
              <p className="text-xl font-bold">{details?.stats.transactionCount}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Activity size={18} />
            Transaction History (Last 12 Months)
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              Received
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              Sent
            </span>
          </div>
        </div>
        {details?.monthlyData && details.monthlyData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={details.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const [year, month] = value.split('-')
                    return `${month}/${year.slice(2)}`
                  }}
                />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Bar dataKey="received" fill="#22C55E" name="Received" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sent" fill="#EF4444" name="Sent" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400">
            No transaction data available
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-gray-400" />
            <h3 className="font-semibold">First Transaction</h3>
          </div>
          <p className="text-lg">{formatDate(details?.stats.firstTransaction || null)}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-gray-400" />
            <h3 className="font-semibold">Last Transaction</h3>
          </div>
          <p className="text-lg">{formatDate(details?.stats.lastTransaction || null)}</p>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="flex items-center justify-between p-4 border-b border-dark-light">
          <div>
            <p className="text-gray-400 text-sm">Address</p>
            <p className="font-mono text-sm">{details?.wallet?.address}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigator.clipboard.writeText(details?.wallet?.address || '')}
            >
              <Copy size={16} />
            </Button>
            <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm">
                <ExternalLink size={16} />
              </Button>
            </a>
          </div>
        </div>
      </Card>

      <div className="flex gap-2 mb-4">
        {(['all', 'in', 'out'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm capitalize ${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-dark-light text-gray-400 hover:text-white'
            }`}
          >
            {f === 'all' ? 'All' : f === 'in' ? 'Received' : 'Sent'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTxs.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-400">No transactions found.</p>
          </Card>
        ) : (
          filteredTxs.map((tx, idx) => (
            <TransactionRow 
              key={tx.hash || idx} 
              tx={tx} 
              onClick={() => setSelectedTx(tx)}
            />
          ))
        )}
      </div>

      <TransactionModal 
        tx={selectedTx} 
        isOpen={!!selectedTx} 
        onClose={() => setSelectedTx(null)} 
      />
    </div>
  )
}