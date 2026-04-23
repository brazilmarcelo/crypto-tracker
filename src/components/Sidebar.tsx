'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { LayoutDashboard, Wallet, Bell, Settings, Tag, X, ArrowRightLeft } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/wallets', label: 'Wallets', icon: Wallet },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/labels', label: 'Labels', icon: Tag },
  { href: '/tracer', label: 'Tracer Tool', icon: ArrowRightLeft },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-dark-light border-r border-muted min-h-screen p-4">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white lg:hidden"
        >
          <X size={24} />
        </button>
      )}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-primary">CryptoTracker</h1>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={twMerge(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}