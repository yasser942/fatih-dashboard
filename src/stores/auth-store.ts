import { create } from 'zustand'
import { getItem, setItem, removeItem } from '@/lib/local-storage'
import type { User } from '@/features/auth/types'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const USER_DATA = 'user_data'

interface AuthState {
  auth: {
    user: User | null
    setUser: (user: User | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const tokenState = getItem(ACCESS_TOKEN)
  const userState = getItem(USER_DATA)

  // Handle token parsing safely
  let initToken = ''
  if (tokenState) {
    try {
      // Try to parse as JSON first (for objects)
      const parsed = JSON.parse(tokenState)
      initToken = typeof parsed === 'string' ? parsed : tokenState
    } catch {
      // If parsing fails, use the raw string (for plain string tokens)
      initToken = tokenState
    }
  }

  // Handle user parsing safely
  let initUser = null
  if (userState) {
    try {
      initUser = JSON.parse(userState)
    } catch {
      // If parsing fails, clear the corrupted data
      removeItem(USER_DATA)
    }
  }

  return {
    auth: {
      user: initUser,
      setUser: (user) =>
        set((state) => {
          if (user) {
            setItem(USER_DATA, user)
          } else {
            removeItem(USER_DATA)
          }
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          // Store the token as a plain string, not JSON
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(ACCESS_TOKEN, accessToken)
            } catch (error) {
              console.error('Error setting access token:', error)
            }
          }
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          if (typeof window !== 'undefined') {
            try {
              localStorage.removeItem(ACCESS_TOKEN)
            } catch (error) {
              console.error('Error removing access token:', error)
            }
          }
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          if (typeof window !== 'undefined') {
            try {
              localStorage.removeItem(ACCESS_TOKEN)
              localStorage.removeItem(USER_DATA)
            } catch (error) {
              console.error('Error clearing auth data:', error)
            }
          }
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})
