import { Button } from '@/components/ui/button'

export function MaintenanceError() {
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>503</h1>
        <span className='font-medium'>الموقع قيد الصيانة!</span>
        <p className='text-muted-foreground text-center'>
          الموقع غير متاح حالياً. <br />
          سنعود للعمل قريباً.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline'>معرفة المزيد</Button>
        </div>
      </div>
    </div>
  )
}
