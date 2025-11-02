import {
  DotsHorizontalIcon,
  Pencil1Icon,
  TrashIcon,
  LockClosedIcon,
  ReaderIcon
} from '@radix-ui/react-icons'
import type { Row } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
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
        <Button
          variant='ghost'
          className='flex size-8 p-0 data-[state=open]:bg-muted hover:bg-muted/50 transition-colors'
        >
          <DotsHorizontalIcon className='size-4' />
          <span className='sr-only'>فتح القائمة</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[200px]'>
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">الإجراءات</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEdit} className="gap-2 cursor-pointer">
          <Pencil1Icon className='size-4' />
          <span>تعديل المستخدم</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleManageRoles} className="gap-2 cursor-pointer">
          <ReaderIcon className='size-4' />
          <span>إدارة الأدوار</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleManagePermissions} className="gap-2 cursor-pointer">
          <LockClosedIcon className='size-4' />
          <span>إدارة الصلاحيات</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleDelete} 
          disabled={user.orders_count && user.orders_count > 0}
          className='text-red-600 focus:text-red-600 gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'
        >
          <TrashIcon className='size-4' />
          <span>حذف المستخدم</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
