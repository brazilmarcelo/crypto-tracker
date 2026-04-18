import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getEthereumBalance } from '@/lib/etherscan'
import { getBitcoinBalance } from '@/lib/blockchain'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const wallets = await prisma.wallet.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  const walletsWithBalance = await Promise.all(
    wallets.map(async (wallet) => {
      let balance = '0'
      try {
        if (wallet.chain === 'ethereum') {
          const wei = await getEthereumBalance(wallet.address)
          balance = (parseInt(wei) / 1e18).toFixed(6)
        } else if (wallet.chain === 'bitcoin') {
          const satoshis = await getBitcoinBalance(wallet.address)
          balance = (satoshis / 1e8).toFixed(8)
        }
      } catch (e) {
        console.error('Error fetching balance:', e)
      }
      return { ...wallet, balance }
    })
  )

  return NextResponse.json(walletsWithBalance)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { address, chain, label } = await req.json()

  if (!address || !chain) {
    return NextResponse.json({ error: 'Address and chain are required' }, { status: 400 })
  }

  const wallet = await prisma.wallet.create({
    data: {
      userId: session.user.id,
      address: address.toLowerCase(),
      chain,
      label,
    },
  })

  return NextResponse.json(wallet)
}