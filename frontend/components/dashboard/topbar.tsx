'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export function Topbar() {
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()

  const handleLogout = () => {
    // Clear client-side storage first
    localStorage.removeItem('authToken')
    localStorage.removeItem('userEmail')
    // Hit the server-side route which nukes the cookie and redirects to /login
    window.location.href = '/api/logout'
  }

  return (
    <div className="border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-8 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        </div>

        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-2 text-muted-foreground transition-colors hover:text-foreground">
            <span className="text-xl">🔔</span>
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {isLoading ? 'Loading...' : user?.email || 'User'}
              </p>
              <p className="text-xs text-muted-foreground">Pro Plan</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-600">
              <span className="text-foreground">👤</span>
            </div>
          </div>

          {/* Logout */}
          <Button size="sm" variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
