import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useCurrencies } from './currencies-provider'

export function CurrenciesPrimaryButtons() {
    const { setOpen } = useCurrencies()

    return (
        <Button onClick={() => setOpen('create')}>
            <Plus className="mr-2 h-4 w-4" />
            إضافة عملة
        </Button>
    )
}

