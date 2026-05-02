"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"

type LoginFormValues = {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMessage(null)
    setIsLoading(true)
    try {
      // Simulate backend authentication delay since backend is down
      await new Promise(r => setTimeout(r, 800))
      
      const access_token = "mock-demo-token-123456"
      localStorage.setItem("authToken", access_token)
      localStorage.setItem("userEmail", data.email)
      
      // Set the critical cookie so middleware.ts lets us into /dashboard
      document.cookie = `authToken=${access_token}; path=/; max-age=86400; SameSite=Lax`
      
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 mb-4 mx-auto">
            <span className="text-xl font-bold">✨</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AI Store Reality
          </h1>
          <p className="text-slate-400 mt-2">Welcome back to your store insights</p>
        </div>

        {/* Login Card */}
        <div className="space-y-6 rounded-2xl border border-purple-500/20 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl shadow-purple-900/20">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-slate-300 mb-2 block">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-purple-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-sm font-semibold text-slate-300 mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-purple-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-purple-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/50 p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-300">{errorMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text hover:opacity-80 transition-opacity">
                Sign up free
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
