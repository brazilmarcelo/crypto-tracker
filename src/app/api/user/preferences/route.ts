import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { emailNotif, whatsappNotif, privacyMode } = await req.json()

  console.log('User preferences:', { emailNotif, whatsappNotif, privacyMode })

  return NextResponse.json({ success: true })
}