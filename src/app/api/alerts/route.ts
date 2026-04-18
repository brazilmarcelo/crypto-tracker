import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const alerts = await prisma.alertRule.findMany({
    where: { userId: session.user.id },
    include: { wallet: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(alerts)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { walletId, type, channel, threshold, thresholdType } = await req.json()

  if (!walletId || !type || !channel) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const alert = await prisma.alertRule.create({
    data: {
      userId: session.user.id,
      walletId,
      type,
      channel,
      threshold: threshold || null,
      thresholdType: thresholdType || 'eth',
    },
  })

  return NextResponse.json(alert)
}