import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import type { Row } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { User } from '../data/schema'
import { useUsers } from './users-provider'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const user = row.original as User
  const { setCurrentRow, setOpen } = useUsers()

  const handleEdit = () => {
    setCurrentRow(user)
    setOpen('update')
  }

  const handleDelete = () => {
    setCurrentRow(user)
    setOpen('delete')
  }

  const handleManageRoles = () => {
    setCurrentRow(user)
    setOpen('roles')
  }

  const handleManagePermissions = () => {
    setCurrentRow(user)
    setOpen('permissions')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
          <DotsHorizontalIcon className='size-4' />
          <span className='sr-only'>فتح القائمة</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleEdit}>تعديل</DropdownMenuItem>
        <DropdownMenuItem onClick={handleManageRoles}>إدارة الأدوار</DropdownMenuItem>
        <DropdownMenuItem onClick={handleManagePermissions}>إدارة الصلاحيات</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className='text-red-600'>
          حذف
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
