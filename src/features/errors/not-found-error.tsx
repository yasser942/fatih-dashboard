import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function NotFoundError() {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>404</h1>
        <span className='font-medium'>عذراً! الصفحة غير موجودة</span>
        <p className='text-muted-foreground text-center'>
          يبدو أن الصفحة التي تبحث عنها غير موجودة <br />
          أو ربما تم حذفها.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            الرجوع
          </Button>
          <Button onClick={() => navigate({ to: '/' })}>العودة إلى الصفحة الرئيسية</Button>
        </div>
      </div>
    </div>
  )
}
