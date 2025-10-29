import { Cross2Icon } from '@radix-ui/react-icons'
import type { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { useMutation } from '@apollo/client/react'
import { BULK_DELETE_USERS_MUTATION } from '../graphql/mutations'
import { USERS_QUERY } from '../graphql/queries'
import { toast } from 'sonner'
import { useUsers } from './users-provider'
import type { User } from '../data/schema'

interface DataTableBulkActionsProps<TData> {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({ table }: DataTableBulkActionsProps<TData>) {
  const { refetch } = useUsers()

  const [bulkDeleteUsers, { loading }] = useMutation(BULK_DELETE_USERS_MUTATION, {
    refetchQueries: [USERS_QUERY],
    onCompleted: () => {
      toast.success('تم حذف المستخدمين بنجاح!')
      table.toggleAllPageRowsSelected(false)
      refetch?.()
    },
    onError: (error) => {
      console.error('Bulk delete users error:', error)
      toast.error('فشل في حذف المستخدمين')
    },
  })

  const handleBulkDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const ids = selectedRows.map((row) => (row.original as User).id)

    if (ids.length === 0) return

    if (
      !window.confirm(`هل أنت متأكد من حذف ${ids.length} مستخدم؟ لا يمكن التراجع عن هذا الإجراء.`)
    ) {
      return
    }

    await bulkDeleteUsers({ variables: { ids } })
  }

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='outline'
        size='sm'
        onClick={handleBulkDelete}
        disabled={loading}
        className='h-8 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground'
      >
        <Cross2Icon className='me-2 size-4' />
        حذف ({table.getFilteredSelectedRowModel().rows.length})
      </Button>
    </div>
  )
}
