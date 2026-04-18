import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getEthereumTransactions, normalizeEtherscanTx } from '@/lib/etherscan'
import { getBitcoinTransactions, normalizeBlockchainTx } from '@/lib/blockchain'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const walletId = searchParams.get('walletId')
  const refresh = searchParams.get('refresh') === 'true'

  const wallets = await prisma.wallet.findMany({
    where: { userId: session.user.id },
  })

  if (!wallets || wallets.length === 0) {
    return NextResponse.json([])
  }

  let allTransactions: any[] = []

  for (const wallet of wallets) {
    if (walletId && wallet.id !== walletId) continue

    let transactions: any[] = []

    try {
      if (wallet.chain === 'ethereum') {
        const txs = await getEthereumTransactions(wallet.address)
        transactions = txs.map(normalizeEtherscanTx)
      } else if (wallet.chain === 'bitcoin') {
        const txs = await getBitcoinTransactions(wallet.address)
        transactions = txs.map(tx => normalizeBlockchainTx(tx, wallet.address))
      }
    } catch (err) {
      console.error(`Failed to fetch ${wallet.chain} transactions:`, err)
    }

    if (transactions.length > 0) {
      for (const tx of transactions) {
        const existing = await prisma.transaction.findFirst({
          where: { walletId: wallet.id, hash: tx.hash }
        })

        if (!existing) {
          await prisma.transaction.create({
            data: {
              walletId: wallet.id,
              hash: tx.hash,
              type: tx.type,
              value: tx.value,
              token: tx.token,
              fee: tx.fee || '0',
              timestamp: new Date(tx.timestamp),
              fromAddress: tx.fromAddress || null,
              toAddress: tx.toAddress || null,
            }
          })
        }
      }
    }

    const dbTxs = await prisma.transaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { timestamp: 'desc' },
      take: 50,
    })

    allTransactions.push(...dbTxs.map(tx => ({
      ...tx,
      label: wallet.label,
      chain: wallet.chain,
    })))
  }

  allTransactions.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return NextResponse.json(allTransactions.slice(0, 50))
}