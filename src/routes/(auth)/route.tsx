import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthGuard } from '@/components/auth-guard'

export const Route = createFileRoute('/(auth)')({
  component: () => (
    <AuthGuard requireAuth={false} redirectTo='/'>
      <Outlet />
    </AuthGuard>
  ),
})
