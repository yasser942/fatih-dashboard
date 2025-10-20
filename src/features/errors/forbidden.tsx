import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function ForbiddenError() {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>403</h1>
        <span className='font-medium'>الوصول مرفوض</span>
        <p className='text-muted-foreground text-center'>
          ليس لديك الأذونات اللازمة <br />
          لعرض هذا المورد.
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
