import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCustomers } from './customers-provider'

export function CustomersPrimaryButtons() {
    const { setOpen } = useCustomers()

    return (
        <Button onClick={() => setOpen('create')}>
            <Plus className="mr-2 h-4 w-4" />
            إضافة عميل
        </Button>
    )
}
