import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useEmployees } from './employees-provider'

export function EmployeesPrimaryButtons() {
    const { setOpen } = useEmployees()

    return (
        <Button onClick={() => setOpen('create')}>
            <Plus className="mr-2 h-4 w-4" />
            إضافة موظف
        </Button>
    )
}




