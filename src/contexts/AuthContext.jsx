import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase credentials
const supabaseUrl = 'https://qkrhpwtmhssafznejiyy.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock authentication check
    const mockUser = localStorage.getItem('cosmic-user')
    if (mockUser) {
      setUser(JSON.parse(mockUser))
    }
    setLoading(false)

    // In production with Supabase:
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    try {
      // Mock sign in
      const mockUser = {
        id: '1',
        email: email,
        name: email.split('@')[0]
      }
      localStorage.setItem('cosmic-user', JSON.stringify(mockUser))
      setUser(mockUser)
      return { user: mockUser, error: null }

      // In production with Supabase:
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { user: data.user, error }
    } catch (error) {
      return { user: null, error }
    }
  }

  const signUp = async (email, password) => {
    try {
      // Mock sign up
      const mockUser = {
        id: '1',
        email: email,
        name: email.split('@')[0]
      }
      localStorage.setItem('cosmic-user', JSON.stringify(mockUser))
      setUser(mockUser)
      return { user: mockUser, error: null }

      // In production with Supabase:
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      return { user: data.user, error }
    } catch (error) {
      return { user: null, error }
    }
  }

  const signOut = async () => {
    try {
      localStorage.removeItem('cosmic-user')
      setUser(null)

      // In production with Supabase:
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}