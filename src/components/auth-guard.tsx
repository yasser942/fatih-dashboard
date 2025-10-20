import { useEffect } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo,
}: AuthGuardProps) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      // User needs to be authenticated but isn't
      // Only redirect if we're not already on the sign-in page
      if (location.pathname !== '/sign-in') {
        navigate({
          to: '/sign-in',
          search: { redirect: location.pathname },
          replace: true,
        })
      }
    } else if (!requireAuth && isAuthenticated) {
      // User is authenticated but shouldn't be on auth pages
      const targetPath = redirectTo || '/'
      navigate({ to: targetPath, replace: true })
    }
  }, [isAuthenticated, requireAuth, navigate, location.pathname, redirectTo])

  // Show loading or nothing while redirecting
  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (!requireAuth && isAuthenticated) {
    return null
  }

  return <>{children}</>
}
