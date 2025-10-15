import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthGuard } from '@/components/auth-guard'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  component: () => (
    <AuthGuard requireAuth={true}>
      <AuthenticatedLayout>
        <Outlet />
      </AuthenticatedLayout>
    </AuthGuard>
  ),
})
