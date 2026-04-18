import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { phone } = await req.json()

  if (!phone) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
  }

  const cleanedPhone = phone.replace(/\D/g, '')
  
  if (cleanedPhone.length < 10 || cleanedPhone.length > 13) {
    return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { 
      phone: phone,
      phoneVerified: false,
    },
  })

  return NextResponse.json({ 
    success: true, 
    phone: user.phone 
  })
}