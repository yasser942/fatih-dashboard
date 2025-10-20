import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Permission } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const permissionsColumns: ColumnDef<Permission>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
                className='translate-y-[2px]'
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
                className='translate-y-[2px]'
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='الاسم' />
        ),
        meta: { className: 'ps-1', tdClassName: 'ps-4' },
        cell: ({ row }) => {
            return (
                <div className='flex space-x-2'>
                    <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
                        {row.getValue('name')}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: 'guard_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='الحارس' />
        ),
        meta: { className: 'ps-1', tdClassName: 'ps-4' },
        cell: ({ row }) => {
            const guardName = row.getValue('guard_name') as string
            return (
                <Badge variant='outline' className='capitalize'>
                    {guardName}
                </Badge>
            )
        },
    },
    {
        accessorKey: 'roles',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='الأدوار' />
        ),
        meta: { className: 'ps-1', tdClassName: 'ps-4' },
        cell: ({ row }) => {
            const roles = row.original.roles || []
            const roleCount = roles.length

            return (
                <div className='flex flex-wrap gap-1'>
                    {roleCount > 0 ? (
                        <>
                            <Badge variant='secondary' className='text-xs'>
                                {roleCount} دور
                            </Badge>
                            {roles.slice(0, 2).map((role) => (
                                <Badge key={role.id} variant='outline' className='text-xs'>
                                    {role.name}
                                </Badge>
                            ))}
                            {roles.length > 2 && (
                                <Badge variant='outline' className='text-xs'>
                                    +{roles.length - 2} أخرى
                                </Badge>
                            )}
                        </>
                    ) : (
                        <span className='text-muted-foreground text-sm'>لا توجد أدوار</span>
                    )}
                </div>
            )
        },
        enableSorting: false,
    },
    {
        accessorKey: 'users_count',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='المستخدمين' />
        ),
        meta: { className: 'ps-1', tdClassName: 'ps-4' },
        cell: ({ row }) => {
            const usersCount = row.getValue('users_count') as number
            return (
                <div className='flex items-center gap-2'>
                    <span className='text-sm'>{usersCount}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='تاريخ الإنشاء' />
        ),
        meta: { className: 'ps-1', tdClassName: 'ps-4' },
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at'))
            return (
                <div className='text-sm text-muted-foreground'>
                    {date.toLocaleDateString()}
                </div>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]
