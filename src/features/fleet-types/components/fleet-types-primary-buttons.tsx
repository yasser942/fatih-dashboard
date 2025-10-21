import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useFleetTypes } from './fleet-types-provider'

export function FleetTypesPrimaryButtons() {
    const { setOpen } = useFleetTypes()

    return (
        <Button onClick={() => setOpen('create')}>
            <Plus className="mr-2 h-4 w-4" />
            إضافة نوع أسطول
        </Button>
    )
}
