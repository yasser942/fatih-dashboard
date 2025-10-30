import { PlusIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { useUsers } from './users-provider'

export function UsersPrimaryButtons() {
  const { setOpen } = useUsers()

  return (
    <Button
      onClick={() => setOpen('create')}
      size="default"
      className="gap-2 shadow-sm hover:shadow-md transition-shadow"
    >
      <PlusIcon className='size-4' />
      <span className="font-medium">إضافة مستخدم جديد</span>
    </Button>
  )
}
