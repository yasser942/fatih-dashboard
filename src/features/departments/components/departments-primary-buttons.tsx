import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useDepartments } from './departments-provider'

export function DepartmentsPrimaryButtons() {
    const { setOpen } = useDepartments()

    return (
        <Button onClick={() => setOpen('create')}>
            <Plus className="mr-2 h-4 w-4" />
            إضافة قسم
        </Button>
    )
}




