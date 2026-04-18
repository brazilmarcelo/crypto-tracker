'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Copy, ExternalLink, Trash2, Wallet as WalletIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface WalletCardProps {
  id: string
  label: string | null
  address: string
  chain: string
  onDelete?: (id: string) => void
}

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function WalletCard({ id, label, address, chain, onDelete }: WalletCardProps) {
  const [copied, setCopied] = useState(false)
  const explorerUrl = chain === 'ethereum' 
    ? `https://etherscan.io/address/${address}`
    : `https://blockchain.info/address/${address}`

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDelete) onDelete(id)
  }

  return (
    <Link href={`/wallets/${id}`} className="block">
      <Card className="flex items-center justify-between cursor-pointer hover:border-primary transition-all hover:scale-[1.01]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-lg">
            <WalletIcon size={24} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-lg">{label || 'Unnamed Wallet'}</p>
            <p className="text-sm text-gray-400 font-mono">{shortenAddress(address)}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-primary/20 text-primary text-xs rounded-full capitalize">
              {chain}
            </span>
          </div>
        </div>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" onClick={handleCopy} title="Copy address">
            <Copy size={18} className={copied ? 'text-accent' : ''} />
          </Button>
          <Link href={explorerUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} title="View on explorer">
            <Button variant="ghost" size="sm">
              <ExternalLink size={18} />
            </Button>
          </Link>
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={handleDelete} title="Delete wallet">
              <Trash2 size={18} className="text-warning" />
            </Button>
          )}
        </div>
      </Card>
    </Link>
  )
}