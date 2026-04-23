'use client'

import { ArrowUpRight, ArrowDownLeft, Building2, Wallet, FileCode2 } from 'lucide-react'
import { useState } from 'react'
import { identifyAddress } from '@/lib/labels'

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
}

interface TransactionWithDetails extends Transaction {
  blockNumber?: string
  gasUsed?: string
  gasPrice?: string
  nonce?: string
  transactionIndex?: string
  input?: string
  cumulativeGasUsed?: string
  gas?: string
}

function shortenHash(hash: string) {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

function shortenAddress(addr: string) {
  if (!addr) return 'N/A'
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function formatDate(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export function TransactionRow({ tx, onClick }: { tx: Transaction | TransactionWithDetails; onClick?: () => void }) {
  const isIn = tx.type === 'in'
  
  // Identify the counterparty
  const counterpartyAddress = isIn ? tx.fromAddress : tx.toAddress
  const entity = identifyAddress(counterpartyAddress)

  const EntityIcon = entity.type === 'exchange' ? Building2 : 
                     entity.type === 'contract' ? FileCode2 : Wallet

  return (
    <div 
      className="flex items-center justify-between p-4 bg-dark rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full ${isIn ? 'bg-accent/20' : 'bg-warning/20'}`}>
          {isIn ? (
            <ArrowDownLeft className="text-accent" size={20} />
          ) : (
            <ArrowUpRight className="text-warning" size={20} />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium capitalize">{isIn ? 'Received' : 'Sent'}</p>
            {counterpartyAddress && (
              <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                entity.type === 'exchange' ? 'bg-blue-500/20 text-blue-400' :
                entity.type === 'contract' ? 'bg-purple-500/20 text-purple-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                <EntityIcon size={10} />
                {entity.name}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 font-mono">{shortenHash(tx.hash)}</p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDate(tx.timestamp)} at {formatTime(tx.timestamp)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-mono text-lg">
          {isIn ? '+' : '-'}{parseFloat(tx.value).toFixed(6)} {tx.token}
        </p>
        {tx.fee && (
          <p className="text-xs text-gray-500">Fee: {parseFloat(tx.fee).toFixed(8)} ETH</p>
        )}
      </div>
    </div>
  )
}

export function TransactionModal({ tx, isOpen, onClose }: { 
  tx: TransactionWithDetails | null; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  if (!isOpen || !tx) return null

  const isIn = tx.type === 'in'

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-dark-light border border-muted rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-muted">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Transaction Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className={`flex items-center gap-3 p-4 rounded-lg ${isIn ? 'bg-accent/10' : 'bg-warning/10'}`}>
            <div className={`p-3 rounded-full ${isIn ? 'bg-accent/20' : 'bg-warning/20'}`}>
              {isIn ? <ArrowDownLeft className="text-accent" size={24} /> : <ArrowUpRight className="text-warning" size={24} />}
            </div>
            <div>
              <p className="text-2xl font-bold">{isIn ? 'Received' : 'Sent'}</p>
              <p className="text-gray-400">{formatDate(tx.timestamp)} at {formatTime(tx.timestamp)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Amount</p>
                <p className="text-xl font-mono font-bold text-accent">{parseFloat(tx.value).toFixed(8)} {tx.token}</p>
              </div>
              {tx.fee && (
                <div>
                  <p className="text-gray-400 text-sm">Transaction Fee</p>
                  <p className="text-lg font-mono">{parseFloat(tx.fee).toFixed(8)} ETH</p>
                </div>
              )}
              {tx.gasUsed && tx.gasPrice && (
                <div>
                  <p className="text-gray-400 text-sm">Gas Used</p>
                  <p className="text-lg font-mono">{parseInt(tx.gasUsed).toLocaleString()} ({(parseInt(tx.gasUsed) * parseInt(tx.gasPrice) / 1e18).toFixed(8)} ETH)</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {tx.blockNumber && (
                <div>
                  <p className="text-gray-400 text-sm">Block Number</p>
                  <p className="text-lg font-mono">#{parseInt(tx.blockNumber).toLocaleString()}</p>
                </div>
              )}
              {tx.nonce !== undefined && (
                <div>
                  <p className="text-gray-400 text-sm">Nonce</p>
                  <p className="text-lg font-mono">{tx.nonce}</p>
                </div>
              )}
              {tx.transactionIndex && (
                <div>
                  <p className="text-gray-400 text-sm">Transaction Index</p>
                  <p className="text-lg font-mono">#{tx.transactionIndex}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-2">Transaction Hash</p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm bg-dark p-2 rounded break-all">{tx.hash}</p>
              <button 
                onClick={() => navigator.clipboard.writeText(tx.hash)}
                className="text-primary hover:text-white text-sm"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">From (Sender)</p>
                {tx.fromAddress && (() => {
                  const entity = identifyAddress(tx.fromAddress)
                  return (
                    <span className="text-xs bg-dark-light px-2 py-1 rounded text-gray-300">
                      {entity.name}
                    </span>
                  )
                })()}
              </div>
              <div className="bg-dark p-3 rounded-lg">
                <p className="font-mono text-sm break-all">{tx.fromAddress || 'N/A'}</p>
                <a 
                  href={`https://etherscan.io/address/${tx.fromAddress}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary text-xs hover:underline mt-1 inline-block"
                >
                  View on Etherscan →
                </a>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">To (Recipient)</p>
                {tx.toAddress && (() => {
                  const entity = identifyAddress(tx.toAddress)
                  return (
                    <span className="text-xs bg-dark-light px-2 py-1 rounded text-gray-300">
                      {entity.name}
                    </span>
                  )
                })()}
              </div>
              <div className="bg-dark p-3 rounded-lg">
                <p className="font-mono text-sm break-all">{tx.toAddress || 'N/A'}</p>
                <a 
                  href={`https://etherscan.io/address/${tx.toAddress}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary text-xs hover:underline mt-1 inline-block"
                >
                  View on Etherscan →
                </a>
              </div>
            </div>
          </div>

          {tx.input && tx.input !== '0x' && (
            <div>
              <p className="text-gray-400 text-sm mb-2">Input Data</p>
              <div className="bg-dark p-3 rounded-lg">
                <p className="font-mono text-xs break-all">{tx.input}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-muted">
          <a 
            href={`https://etherscan.io/tx/${tx.hash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-center bg-primary hover:bg-primary-light text-white py-3 rounded-lg font-medium transition-colors"
          >
            View Full Details on Etherscan →
          </a>
        </div>
      </div>
    </div>
  )
}