import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useTaskTypes } from './task-types-provider'

export function TaskTypesPrimaryButtons() {
    const { setOpen } = useTaskTypes()

    return (
        <Button onClick={() => setOpen('create')} size="lg" className="shadow-sm">
            <Plus className="mr-2 h-5 w-5" />
            إضافة نوع مهمة
        </Button>
    )
}

