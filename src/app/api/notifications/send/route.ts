import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { sendWhatsAppMessage, createTransactionAlertMessage } from '@/lib/whatsapp'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { transactionId, walletId, type, value, token, hash, timestamp } = await req.json()

  if (!transactionId || !walletId || !value) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      alertRules: {
        where: {
          walletId,
          isActive: true,
        },
      },
    },
  })

  if (!user || !user.phone) {
    return NextResponse.json({ error: 'User or phone not found' }, { status: 400 })
  }

  const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const results: any[] = []

  for (const alert of user.alertRules) {
    const shouldNotify = 
      (alert.type === 'both') ||
      (alert.type === type) ||
      (alert.channel === 'both' || alert.channel === 'whatsapp')

    if (!shouldNotify) continue

    const threshold = alert.threshold ? parseFloat(alert.threshold) : 0
    const txValue = parseFloat(value)
    
    if (threshold > 0 && txValue < threshold) continue

    const message = createTransactionAlertMessage(
      type,
      value,
      token,
      'My Wallet',
      walletId,
      appUrl,
      timestamp || new Date()
    )

    if (alert.channel === 'whatsapp' || alert.channel === 'both') {
      const sent = await sendWhatsAppMessage({
        to: user.phone,
        body: message,
      })

      await prisma.notification.create({
        data: {
          userId: user.id,
          alertRuleId: alert.id,
          transactionId,
          channel: 'whatsapp',
          message,
          sentAt: new Date(),
        },
      })

      results.push({ channel: 'whatsapp', success: sent })
    }

    if (alert.channel === 'email' || alert.channel === 'both') {
      // Email notification - would integrate with Resend/SendGrid
      await prisma.notification.create({
        data: {
          userId: user.id,
          alertRuleId: alert.id,
          transactionId,
          channel: 'email',
          message: `Transaction ${type}: ${value} ${token}`,
        },
      })

      results.push({ channel: 'email', success: true })
    }
  }

  return NextResponse.json({ results })
}