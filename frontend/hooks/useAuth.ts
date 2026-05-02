'use client'

import { useEffect, useState } from 'react'

export interface User {
  id: number
  email: string
}

export interface UseAuthReturn {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => void
  setToken: (token: string) => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    const storedEmail = localStorage.getItem('userEmail')
    if (storedToken && storedEmail) {
      setToken(storedToken)
      setUser({ id: 1, email: storedEmail })
    }
    setIsLoading(false)
  }, [])

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('userEmail')
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  }

  const setTokenAndFetch = (newToken: string) => {
    setToken(newToken)
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    logout,
    setToken: setTokenAndFetch,
  }
}
