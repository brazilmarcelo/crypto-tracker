import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

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

    const dbTxs = await prisma.transaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { timestamp: 'desc' },
      take: 50,
    })

    allTransactions.push(...dbTxs.map(tx => ({
      ...tx,
      label: wallet.label,
      chain: wallet.chain,
      address: wallet.address,
    })))
  }

  allTransactions.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return NextResponse.json(allTransactions.slice(0, 50))
}