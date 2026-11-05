"use client"

import * as React from "react"

export type User = {
  name: string
  email: string
  image: string | null
}

type AuthContextValue = {
  user: User | null
  login: () => void
  logout: () => void
}

// Placeholder user for the demo login button. Replace `login` with a real
// flow (credential check, OAuth redirect, session cookie, ...) once the
// backend/auth pages exist.
const DEMO_USER: User = {
  name: "Demo User",
  email: "demo@example.com",
  image: "https://i.pravatar.cc/64?img=12",
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)

  const login = React.useCallback(() => setUser(DEMO_USER), [])
  const logout = React.useCallback(() => setUser(null), [])

  const value = React.useMemo(
    () => ({ user, login, logout }),
    [user, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within <AuthProvider>")
  }
  return context
}
