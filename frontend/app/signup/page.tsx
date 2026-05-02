"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react"

type SignupFormValues = {
  email: string
  password: string
  confirmPassword: string
}

export default function SignupPage() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const password = watch("password")

  const onSubmit = async (data: SignupFormValues) => {
    setErrorMessage(null)
    if (data.password !== data.confirmPassword) {
      setErrorMessage("Passwords do not match")
      return
    }
    setIsLoading(true)
    try {
      // Simulate backend registration processing
      await new Promise(r => setTimeout(r, 1200))
      
      const mockToken = "mock-demo-token-123456"
      localStorage.setItem("authToken", mockToken)
      localStorage.setItem("userEmail", data.email)
      document.cookie = `authToken=${mockToken}; path=/; max-age=86400; SameSite=Lax`
      router.push("/dashboard")
    } catch (error) {
      console.error("Signup error:", error)
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = password ? Math.min(Math.ceil((password.length - 4) / 4), 3) : 0
  const passwordStrengthText = ["Weak", "Fair", "Good", "Strong"][passwordStrength] || "Too short"
  const passwordStrengthColor = ["bg-red-500", "bg-yellow-500", "bg-green-500", "bg-emerald-500"][passwordStrength] || "bg-slate-700"

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
          <p className="text-slate-400 mt-2">Get started with AI-powered store insights</p>
        </div>

        {/* Signup Card */}
        <div className="space-y-6 rounded-2xl border border-purple-500/20 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl shadow-purple-900/20">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                    minLength: { value: 8, message: "Use at least 8 characters" },
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
              {password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Password strength</span>
                    <span className={`font-semibold ${["text-red-400", "text-yellow-400", "text-green-400", "text-emerald-400"][passwordStrength]}`}>
                      {passwordStrengthText}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${passwordStrengthColor} transition-all duration-300`} style={{ width: `${(passwordStrength + 1) * 25}%` }} />
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-300 mb-2 block">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-purple-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === password || "Passwords must match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-purple-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!errors.confirmPassword && password && watch("confirmPassword") === password && (
                <p className="mt-2 text-sm text-green-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Passwords match
                </p>
              )}
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword.message}
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
                  Creating account...
                </>
              ) : (
                <>
                  Create account
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
              <span className="px-2 bg-slate-900 text-slate-400">Already have an account?</span>
            </div>
          </div>

          {/* Sign In Link */}
          <Link href="/login">
            <Button variant="secondary" className="w-full border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
              Sign in instead
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-8">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
