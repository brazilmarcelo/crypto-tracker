'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { Loader2 } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && status === 'unauthenticated') {
      router.push('/')
    }
  }, [isClient, status, router])

  if (!isClient || status === 'loading') {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const isAuthPage = pathname === '/'

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-dark">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}