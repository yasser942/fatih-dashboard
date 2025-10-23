import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFleets } from './fleets-provider'

export function FleetsPrimaryButtons() {
    const { setOpen } = useFleets()

    return (
        <Button onClick={() => setOpen('create')}>
            <Plus className="mr-2 h-4 w-4" />
            إضافة مركبة جديدة
        </Button>
    )
}


