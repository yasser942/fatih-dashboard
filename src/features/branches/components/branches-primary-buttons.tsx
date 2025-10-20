import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useBranches } from './branches-provider'

export function BranchesPrimaryButtons() {
    const { setOpen } = useBranches()
    return (
        <div className="flex items-center gap-2">
            <Button onClick={() => setOpen('create')}>
                <Plus className="me-2 h-4 w-4" /> إضافة فرع
            </Button>
        </div>
    )
}


