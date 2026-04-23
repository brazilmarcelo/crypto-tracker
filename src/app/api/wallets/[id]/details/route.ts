import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getEthereumBalance, getEthereumTransactions, normalizeEtherscanTx } from '@/lib/etherscan'
import { getBitcoinBalance, getBitcoinTransactions, normalizeBlockchainTx } from '@/lib/blockchain'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const wallet = await prisma.wallet.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
  }

  let balance = '0'
  let transactions: any[] = []
  let stats = {
    totalReceived: '0',
    totalSent: '0',
    transactionCount: 0,
    firstTransaction: null as string | null,
    lastTransaction: null as string | null,
  }

  if (wallet.chain === 'ethereum') {
    const wei = await getEthereumBalance(wallet.address)
    balance = (parseInt(wei) / 1e18).toFixed(6)
    const txs = await getEthereumTransactions(wallet.address)
    transactions = txs.map(tx => normalizeEtherscanTx(tx, wallet.address))
  } else if (wallet.chain === 'bitcoin') {
    const satoshis = await getBitcoinBalance(wallet.address)
    balance = (satoshis / 1e8).toFixed(8)
    const txs = await getBitcoinTransactions(wallet.address)
    transactions = txs.map(tx => normalizeBlockchainTx(tx, wallet.address))
  }

  if (transactions.length > 0) {
    const received = transactions
      .filter(tx => tx.type === 'in')
      .reduce((sum, tx) => sum + parseFloat(tx.value), 0)
    const sent = transactions
      .filter(tx => tx.type === 'out')
      .reduce((sum, tx) => sum + parseFloat(tx.value), 0)

    stats = {
      totalReceived: received.toFixed(6),
      totalSent: sent.toFixed(6),
      transactionCount: transactions.length,
      firstTransaction: transactions[transactions.length - 1]?.timestamp || null,
      lastTransaction: transactions[0]?.timestamp || null,
    }
  }

  const transactionsByMonth: Record<string, { received: number; sent: number }> = {}
  transactions.forEach(tx => {
    const date = new Date(tx.timestamp)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (!transactionsByMonth[key]) {
      transactionsByMonth[key] = { received: 0, sent: 0 }
    }
    if (tx.type === 'in') {
      transactionsByMonth[key].received += parseFloat(tx.value)
    } else {
      transactionsByMonth[key].sent += parseFloat(tx.value)
    }
  })

  const monthlyData = Object.entries(transactionsByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, data]) => ({
      month,
      received: data.received,
      sent: data.sent,
    }))

  return NextResponse.json({
    wallet,
    balance,
    stats,
    transactions: transactions.slice(0, 50),
    monthlyData,
  })
}