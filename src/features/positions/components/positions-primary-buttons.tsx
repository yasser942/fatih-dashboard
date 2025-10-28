import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { usePositions } from './positions-provider'

export function PositionsPrimaryButtons() {
    const { setOpen } = usePositions()

    return (
        <Button onClick={() => setOpen('create')}>
            <Plus className="mr-2 h-4 w-4" />
            إضافة وظيفة
        </Button>
    )
}




