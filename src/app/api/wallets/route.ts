import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const wallets = await prisma.wallet.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(wallets)
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