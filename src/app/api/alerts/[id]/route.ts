import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.alertRule.delete({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  return NextResponse.json({ success: true })
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { isActive, walletId, type, channel, threshold, thresholdType } = body

  const updateData: any = {}
  
  if (isActive !== undefined) updateData.isActive = isActive
  if (walletId !== undefined) updateData.walletId = walletId
  if (type !== undefined) updateData.type = type
  if (channel !== undefined) updateData.channel = channel
  if (threshold !== undefined) updateData.threshold = threshold || null
  if (thresholdType !== undefined) updateData.thresholdType = thresholdType

  const alert = await prisma.alertRule.update({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    data: updateData,
  })

  return NextResponse.json(alert)
}