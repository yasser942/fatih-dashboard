import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { LOGOUT_MUTATION } from '../graphql/mutations'

export function useLogout() {
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const [logoutMutation, { loading }] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      // Reset auth store
      auth.reset()
      toast.success('تم تسجيل الخروج بنجاح')
      // Redirect to sign-in page
      navigate({ to: '/sign-in' })
    },
    onError: (_error) => {
      toast.error('فشل في تسجيل الخروج')
    },
  })

  const logout = async () => {
    try {
      await logoutMutation()
    } catch (_error) {
      // Even if logout fails on server, clear local state
      auth.reset()
      navigate({ to: '/sign-in' })
    }
  }

  return {
    logout,
    loading,
  }
}
