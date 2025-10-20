import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useLocationMasters } from './location-masters-provider'

export function LocationMastersPrimaryButtons() {
    const { setOpen } = useLocationMasters()

    return (
        <Button onClick={() => setOpen('create')}>
            <Plus className="mr-2 h-4 w-4" />
            إضافة موقع
        </Button>
    )
}

