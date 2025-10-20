import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRoles } from './roles-provider'

export function RolesPrimaryButtons() {
    const { setOpen } = useRoles()
    return (
        <div className='flex gap-2'>
            <Button className='space-x-1' onClick={() => setOpen('create')}>
                <span>إنشاء دور</span> <Plus size={18} />
            </Button>
        </div>
    )
}
