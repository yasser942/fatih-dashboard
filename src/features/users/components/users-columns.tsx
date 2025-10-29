import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'
import type { User, UserStatus } from '../data/schema'
import { formatDate } from '@/lib/utils'

const statusColors: Record<UserStatus, string> = {
  Active: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  Inactive: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20',
  Pending: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  Blocked: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
}

const statusLabels: Record<UserStatus, string> = {
  Active: 'نشط',
  Inactive: 'غير نشط',
  Pending: 'معلق',
  Blocked: 'محظور',
}

export const usersColumns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='اختيار الكل'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='اختيار الصف'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='ID' />,
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'full_name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='الاسم الكامل' />,
    cell: ({ row }) => {
      const fullName = row.getValue('full_name') as string | null
      const name = row.original.name
      return <div className='max-w-[200px] truncate font-medium'>{fullName || name}</div>
    },
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='البريد الإلكتروني' />,
    cell: ({ row }) => <div className='max-w-[200px] truncate'>{row.getValue('email')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => <DataTableColumnHeader column={column} title='الهاتف' />,
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string | null
      return <div className='max-w-[150px] truncate'>{phone || '-'}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'Job',
    header: ({ column }) => <DataTableColumnHeader column={column} title='الوظيفة' />,
    cell: ({ row }) => {
      const job = row.getValue('Job') as string | null
      return <div className='max-w-[150px] truncate'>{job || '-'}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='الحالة' />,
    cell: ({ row }) => {
      const status = row.getValue('status') as UserStatus
      return (
        <Badge variant='outline' className={statusColors[status]}>
          {statusLabels[status]}
        </Badge>
      )
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'roles',
    header: 'الأدوار',
    cell: ({ row }) => {
      const roles = row.original.roles || []
      if (roles.length === 0) return <div className='text-muted-foreground'>-</div>
      return (
        <div className='flex flex-wrap gap-1'>
          {roles.slice(0, 2).map((role) => (
            <Badge key={role.id} variant='secondary' className='text-xs'>
              {role.name}
            </Badge>
          ))}
          {roles.length > 2 && (
            <Badge variant='secondary' className='text-xs'>
              +{roles.length - 2}
            </Badge>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title='تاريخ الإنشاء' />,
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string
      return <div className='text-muted-foreground'>{formatDate(date)}</div>
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
