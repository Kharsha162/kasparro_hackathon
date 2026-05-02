'use client'

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check for auth token
    const storedToken = localStorage.getItem('token')
    setToken(storedToken)
    setIsLoading(false)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC'
    setToken(null)
    router.push('/')
    setIsMobileMenuOpen(false)
  }

  const navItems = token
    ? [{ href: "/dashboard", label: "Dashboard" }]
    : [
        { href: "#features", label: "Features" },
        { href: "/login", label: "Login" }
      ]

  const isActiveLink = (href: string) => {
    if (href.startsWith('#')) return false
    return pathname === href
  }

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 border-b border-white/10 glass">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="h-6 w-32 loading-skeleton rounded" />
          <div className="h-8 w-20 loading-skeleton rounded" />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 glass animate-fade-in">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-xl font-bold tracking-tight text-white transition-all duration-200 hover:scale-105"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="hidden sm:block">AI Store Reality</span>
          <span className="sm:hidden">AI Store</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-all duration-200 hover:text-white hover:scale-105",
                isActiveLink(item.href)
                  ? "text-white"
                  : "text-slate-300"
              )}
            >
              {item.label}
            </Link>
          ))}

          {token ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleLogout}
              className="hover-lift"
            >
              Logout
            </Button>
          ) : (
            <Button asChild size="sm" className="hover-lift">
              <Link href="/signup">Sign up</Link>
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 glass animate-slide-in">
          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 hover:bg-white/10",
                    isActiveLink(item.href)
                      ? "text-white bg-white/10"
                      : "text-slate-300 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              ))}

              {token ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleLogout}
                  className="w-full justify-start hover-lift"
                >
                  Logout
                </Button>
              ) : (
                <Button asChild size="sm" className="w-full hover-lift">
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign up
                  </Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
