import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOrders } from './orders-provider'

export function OrdersPrimaryButtons() {
    const { setOpen } = useOrders()

    return (
        <Button onClick={() => setOpen('create')}>
            <Plus className="mr-2 h-4 w-4" />
            إضافة شحنة جديدة
        </Button>
    )
}
