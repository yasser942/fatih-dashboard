import { PlusIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { useUsers } from './users-provider'

export function UsersPrimaryButtons() {
  const { setOpen } = useUsers()

  return (
    <Button onClick={() => setOpen('create')}>
      <PlusIcon className='me-2 size-4' />
      إضافة مستخدم
    </Button>
  )
}
