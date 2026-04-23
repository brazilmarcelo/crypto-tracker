'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Search, Loader2, ArrowRight } from 'lucide-react'
import { identifyAddress } from '@/lib/labels'

interface TracerTx {
  hash: string
  toAddress: string
  value: string
  timestamp: string
}

function shortenAddress(addr: string) {
  if (!addr) return 'N/A'
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function TraceNode({ address, amountValue, depth = 0 }: { address: string, amountValue?: string, depth?: number }) {
  const [childrenTxs, setChildrenTxs] = useState<TracerTx[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [traced, setTraced] = useState(false)

  const entity = identifyAddress(address)

  const handleTrace = async () => {
    if (isExpanded) {
      setIsExpanded(false)
      return
    }

    if (traced) {
      setIsExpanded(true)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/tracer?address=${address}`)
      if (res.ok) {
        const data = await res.json()
        setChildrenTxs(data.outgoingTxs || [])
        setTraced(true)
        setIsExpanded(true)
      }
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
  }

  return (
    <div className={`mt-2 ${depth > 0 ? 'ml-8 pl-4 border-l-2 border-dark-light' : ''}`}>
      <Card className="p-4 inline-block w-full max-w-lg mb-2 relative">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                entity.type === 'exchange' ? 'bg-blue-500/20 text-blue-400' :
                entity.type === 'contract' ? 'bg-purple-500/20 text-purple-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {entity.name}
              </span>
              {amountValue && (
                <span className="text-accent text-sm font-bold">+{parseFloat(amountValue).toFixed(4)} ETH</span>
              )}
            </div>
            <p className="font-mono text-sm text-gray-300">{address}</p>
          </div>
          
          <Button 
            variant={isExpanded ? "secondary" : "primary"} 
            size="sm" 
            onClick={handleTrace}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : 
             isExpanded ? 'Collapse' : 'Trace'}
          </Button>
        </div>
      </Card>

      {isExpanded && childrenTxs.length > 0 && (
        <div className="flex flex-col gap-2">
          {childrenTxs.map((tx) => (
            <div key={tx.hash} className="flex items-start">
              <div className="mt-6 -ml-4 w-4 h-0.5 bg-dark-light hidden sm:block"></div>
              <TraceNode 
                address={tx.toAddress} 
                amountValue={tx.value} 
                depth={depth + 1} 
              />
            </div>
          ))}
        </div>
      )}
      {isExpanded && traced && childrenTxs.length === 0 && (
        <div className="ml-8 text-sm text-gray-500 italic py-2">
          No outgoing transactions found. End of trace.
        </div>
      )}
    </div>
  )
}

export default function TracerPage() {
  const [searchInput, setSearchInput] = useState('')
  const [rootAddress, setRootAddress] = useState<string | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchInput) return
    setRootAddress(searchInput)
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Tracer Tool</h1>
        <p className="text-gray-400">Trace funds sequentially through wallets. Start with an initial address to begin tracing.</p>
      </div>

      <Card className="mb-8">
        <form onSubmit={handleSearch} className="p-4 flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter initial Ethereum Address..."
              className="w-full bg-dark border border-muted rounded-lg px-4 py-2 text-white outline-none focus:border-primary transition-colors"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button type="submit" className="flex items-center gap-2">
            <Search size={18} />
            Start Trace
          </Button>
        </form>
      </Card>

      {rootAddress ? (
        <div className="bg-dark rounded-xl p-6 overflow-x-auto">
          <TraceNode address={rootAddress} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <ArrowRight size={48} className="mb-4 opacity-20" />
          <p>Enter an address above to map out its capital flow.</p>
          <p className="text-sm mt-2 opacity-60">Uses Etherscan API mapping via depth-first-search approach.</p>
        </div>
      )}
    </div>
  )
}
