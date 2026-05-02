'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
  },
  {
    label: 'Analysis',
    href: '/dashboard/analysis',
    icon: '🔍',
  },
  {
    label: 'Replay',
    href: '/dashboard/replay',
    icon: '▶️',
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: '⚙️',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-8">
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
            <span className="text-lg font-bold text-primary">🤖</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">AI Store</p>
            <p className="text-xs text-muted-foreground">Reality Engine</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:bg-card text-card-foreground/50 hover:text-foreground'
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

    </aside>
  )
}
