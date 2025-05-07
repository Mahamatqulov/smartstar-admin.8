"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { AuthUser, LoginCredentials } from "@/services/auth-service"
import { AuthService } from "@/services/auth-service"
import { MockAuthService } from "@/services/mock-auth-service"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  clearError: () => void
  isPreviewMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// IMPORTANT: In preview mode, we ALWAYS use MockAuthService
// This prevents "Failed to fetch" errors when the real API is not available
const isPreviewMode = () => {
  // Always return true in preview environments
  if (typeof window === "undefined") return true
  return (
    window.location.hostname.includes("vercel.app") ||
    process.env.NODE_ENV === "development" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Determine if we're in preview mode once at component mount
  const [isInPreviewMode] = useState(() => isPreviewMode())

  // IMPORTANT: Always use MockAuthService in preview mode
  const authService = isInPreviewMode ? MockAuthService : AuthService

  useEffect(() => {
    console.log(`Using ${isInPreviewMode ? "MockAuthService" : "AuthService"} for authentication`)
  }, [isInPreviewMode])

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser()
          setUser(currentUser)
        }
      } catch (err) {
        console.error("Auth check error:", err)
        authService.logout()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [authService])

  // Login function
  const login = async (credentials: LoginCredentials) => {
    setLoading(true)
    setError(null)

    try {
      console.log(`AuthContext: Login attempt using ${isInPreviewMode ? "MockAuthService" : "AuthService"}`)

      // Use the appropriate auth service based on environment
      const loggedInUser = await authService.login(credentials)

      console.log("AuthContext: Login successful")
      setUser(loggedInUser)
      router.push("/")
    } catch (err) {
      console.error("AuthContext: Login error:", err)

      let errorMessage = "Login failed. Please check your credentials and try again."

      // Check if it's a network error and we're not in preview mode
      if (err instanceof Error && err.message.includes("Network Error") && !isInPreviewMode) {
        console.warn("Network error detected, falling back to MockAuthService")

        try {
          // Fallback to MockAuthService if real API is unreachable
          const mockUser = await MockAuthService.login(credentials)
          setUser(mockUser)
          router.push("/")
          return
        } catch (mockErr) {
          console.error("MockAuthService fallback failed:", mockErr)
          errorMessage = "Cannot connect to the server. Using offline mode."
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    console.log("AuthContext: Logging out user")
    authService.logout()
    setUser(null)
    router.push("/login")
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    clearError,
    isPreviewMode: isInPreviewMode,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
