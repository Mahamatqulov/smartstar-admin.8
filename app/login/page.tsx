"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Lock, User, AlertCircle, Info, Wifi, WifiOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { login, loading, error, clearError, user, isPreviewMode } = useAuth()
  const router = useRouter()
  const [networkStatus, setNetworkStatus] = useState<"online" | "offline" | "unknown">("unknown")

  // Set default credentials in preview mode
  useEffect(() => {
    if (isPreviewMode) {
      setUsername("admin")
      setPassword("admin123")
    }
  }, [isPreviewMode])

  // Check network status
  useEffect(() => {
    const updateNetworkStatus = () => {
      setNetworkStatus(navigator.onLine ? "online" : "offline")
    }

    // Set initial status
    updateNetworkStatus()

    // Add event listeners
    window.addEventListener("online", updateNetworkStatus)
    window.addEventListener("offline", updateNetworkStatus)

    // Clean up
    return () => {
      window.removeEventListener("online", updateNetworkStatus)
      window.removeEventListener("offline", updateNetworkStatus)
    }
  }, [])

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    // Basic validation
    if (!username.trim() || !password.trim()) {
      return
    }

    try {
      console.log(`LoginPage: Submitting login in ${isPreviewMode ? "preview" : "production"} mode`)

      // Ensure we're passing the trimmed values
      await login({
        login: username.trim(),
        password: password.trim(),
      })
    } catch (err) {
      console.error("LoginPage: Login submission error:", err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-100 to-white relative overflow-hidden">
      {/* Wave background */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] bg-green-100 rounded-b-[50%] w-[120%] -ml-[10%]"></div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Logo and header */}
          <div className="pt-8 pb-4 px-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <span className="text-green-600 text-2xl font-bold">S</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">SmartStar Admin</h1>
            <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {isPreviewMode && (
              <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 text-blue-700 text-sm rounded flex items-start">
                <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Preview Mode</p>
                  <p>Using mock authentication. Default credentials are pre-filled.</p>
                </div>
              </div>
            )}

            {networkStatus !== "unknown" && (
              <div
                className={`mb-4 p-3 ${networkStatus === "online" ? "bg-green-50 border-green-500 text-green-700" : "bg-amber-50 border-amber-500 text-amber-700"} border-l-4 text-sm rounded flex items-start`}
              >
                {networkStatus === "online" ? (
                  <Wifi className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                ) : (
                  <WifiOff className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium">{networkStatus === "online" ? "Online Mode" : "Offline Mode"}</p>
                  <p>
                    {networkStatus === "online"
                      ? "Connected to the server."
                      : "Using local data. Some features may be limited."}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
                  Login
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>

          {/* Demo credentials */}
          {isPreviewMode && (
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center text-sm text-gray-600">
              <p>Demo credentials: login: admin, password: admin123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
