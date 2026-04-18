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

  return NextResponse.json(wallet)
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.wallet.delete({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  return NextResponse.json({ success: true })
}