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
  const initToken = tokenState ? JSON.parse(tokenState) : ''
  const initUser = userState ? JSON.parse(userState) : null

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
          setItem(ACCESS_TOKEN, accessToken)
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeItem(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeItem(ACCESS_TOKEN)
          removeItem(USER_DATA)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})
