import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getEthereumTransactions, normalizeEtherscanTx, EtherscanTx } from '@/lib/etherscan'
import { getBitcoinTransactions, normalizeBlockchainTx } from '@/lib/blockchain'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const walletId = searchParams.get('walletId')
  const refresh = searchParams.get('refresh') === 'true'

  if (!walletId) {
    return NextResponse.json({ error: 'Wallet ID required' }, { status: 400 })
  }

  const wallet = await prisma.wallet.findFirst({
    where: {
      id: walletId,
      userId: session.user.id,
    },
  })

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
  }

  let transactions: any[] = []

  try {
    if (wallet.chain === 'ethereum') {
      const txs = await getEthereumTransactions(wallet.address)
      transactions = txs.map(normalizeEtherscanTx)
      
      if (transactions.length > 0 && !refresh) {
        await prisma.transaction.createMany({
          data: transactions.slice(0, 20).map(tx => ({
            walletId: wallet.id,
            hash: tx.hash,
            type: tx.type,
            value: tx.value,
            token: tx.token,
            fee: tx.fee,
            timestamp: new Date(tx.timestamp),
            fromAddress: tx.fromAddress,
            toAddress: tx.toAddress,
          })),
          skipDuplicates: true,
        })
      }
    } else if (wallet.chain === 'bitcoin') {
      const txs = await getBitcoinTransactions(wallet.address)
      transactions = txs.map(tx => normalizeBlockchainTx(tx, wallet.address))
    }
  } catch (err) {
    console.error('Failed to fetch transactions:', err)
    
    transactions = await prisma.transaction.findMany({
      where: { walletId },
      orderBy: { timestamp: 'desc' },
      take: 100,
    })
  }

  return NextResponse.json(transactions)
}