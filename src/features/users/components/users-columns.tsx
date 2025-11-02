import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'
import type { User, UserStatus } from '../data/schema'
import { formatDate } from '@/lib/utils'
import {
  CheckCircledIcon,
  CrossCircledIcon,
  ClockIcon,
  LockClosedIcon,
  EnvelopeClosedIcon,
  MobileIcon,
  BackpackIcon,
  PersonIcon,
  IdCardIcon
} from '@radix-ui/react-icons'

const statusConfig: Record<UserStatus, { icon: React.ReactNode; color: string; label: string }> = {
  Active: {
    icon: <CheckCircledIcon className="h-3 w-3" />,
    color: 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20',
    label: 'نشط',
  },
  Inactive: {
    icon: <CrossCircledIcon className="h-3 w-3" />,
    color: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-gray-500/20',
    label: 'غير نشط',
  },
  Pending: {
    icon: <ClockIcon className="h-3 w-3" />,
    color: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20',
    label: 'معلق',
  },
  Blocked: {
    icon: <LockClosedIcon className="h-3 w-3" />,
    color: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20',
    label: 'محظور',
  },
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
    header: ({ column }) => <DataTableColumnHeader column={column} title='المستخدم' />,
    cell: ({ row }) => {
      const fullName = row.getValue('full_name') as string | null
      const name = row.original.name
      const email = row.original.email
      const displayName = fullName || name
      const initials = displayName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

      return (
        <div className='flex items-center gap-3'>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className='font-medium text-sm'>{displayName}</span>
            <span className='text-xs text-muted-foreground flex items-center gap-1'>
              <EnvelopeClosedIcon className="h-3 w-3" />
              {email}
            </span>
          </div>
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => <DataTableColumnHeader column={column} title='الهاتف' />,
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string | null
      return phone ? (
        <div className='flex items-center gap-2 text-sm'>
          <MobileIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-mono">{phone}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'Job',
    header: ({ column }) => <DataTableColumnHeader column={column} title='الوظيفة' />,
    cell: ({ row }) => {
      const job = row.getValue('Job') as string | null
      return job ? (
        <div className='flex items-center gap-2'>
          <BackpackIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className='text-sm'>{job}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='الحالة' />,
    cell: ({ row }) => {
      const status = row.getValue('status') as UserStatus
      const config = statusConfig[status]
      return (
        <Badge variant='outline' className={`${config.color} gap-1.5`}>
          {config.icon}
          {config.label}
        </Badge>
      )
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'user_kind',
    header: 'النوع',
    cell: ({ row }) => {
      const user = row.original
      const isCustomer = user.customer !== null && user.customer !== undefined
      const isEmployee = user.employee !== null && user.employee !== undefined

      if (isEmployee) {
        return (
          <Badge variant='outline' className='bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-500/20 gap-1.5'>
            <IdCardIcon className="h-3 w-3" />
            موظف
          </Badge>
        )
      }

      if (isCustomer) {
        return (
          <Badge variant='outline' className='bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-orange-500/20 gap-1.5'>
            <PersonIcon className="h-3 w-3" />
            عميل
          </Badge>
        )
      }

      return (
        <Badge variant='outline' className='bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 border-gray-500/20 gap-1.5'>
          <PersonIcon className="h-3 w-3" />
          مستخدم
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'roles',
    header: 'الأدوار',
    cell: ({ row }) => {
      const roles = row.original.roles || []
      if (roles.length === 0) return <span className='text-muted-foreground text-sm'>-</span>
      return (
        <div className='flex flex-wrap gap-1'>
          {roles.slice(0, 2).map((role) => (
            <Badge key={role.id} variant='secondary' className='text-xs font-medium bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'>
              {role.name}
            </Badge>
          ))}
          {roles.length > 2 && (
            <Badge variant='outline' className='text-xs font-mono'>
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
