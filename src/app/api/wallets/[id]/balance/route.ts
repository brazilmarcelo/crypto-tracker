import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getEthereumBalance } from '@/lib/etherscan'
import { getBitcoinBalance } from '@/lib/blockchain'

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

  if (wallet.chain === 'ethereum') {
    const wei = await getEthereumBalance(wallet.address)
    balance = (parseInt(wei) / 1e18).toFixed(6)
  } else if (wallet.chain === 'bitcoin') {
    const satoshis = await getBitcoinBalance(wallet.address)
    balance = (satoshis / 1e8).toFixed(8)
  }

  return NextResponse.json({ balance })
}