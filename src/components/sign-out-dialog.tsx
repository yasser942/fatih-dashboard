import { ConfirmDialog } from '@/components/confirm-dialog'
import { useLogout } from '@/features/auth/hooks/useLogout'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const { logout, loading } = useLogout()

  const handleSignOut = async () => {
    await logout()
    onOpenChange(false)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='تسجيل الخروج'
      desc='هل أنت متأكد من أنك تريد تسجيل الخروج؟ ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حسابك.'
      confirmText={loading ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
      cancelBtnText='إلغاء'
      handleConfirm={handleSignOut}
      className='sm:max-w-sm'
      disabled={loading}
    />
  )
}
