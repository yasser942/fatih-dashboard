import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { Tag, Shield, Lock, Users, Calendar } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { type Role } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const rolesColumns: ColumnDef<Role>[] = [
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
            <DataTableColumnHeader column={column} title='الاسم' icon={<Tag className='h-4 w-4' />} />
        ),
        meta: { className: 'ps-1', tdClassName: 'ps-4' },
        cell: ({ row }) => {
            return (
                <div className='flex items-center gap-2'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10'>
                        <Tag className='h-4 w-4 text-primary' />
                    </div>
                    <span className='max-w-32 truncate font-semibold sm:max-w-72 md:max-w-[31rem]'>
                        {row.getValue('name')}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: 'guard_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='الحارس' icon={<Shield className='h-4 w-4' />} />
        ),
        meta: { className: 'ps-1', tdClassName: 'ps-4' },
        cell: ({ row }) => {
            const guardName = row.getValue('guard_name') as string
            return (
                <Badge variant='outline' className='capitalize flex items-center gap-1.5 w-fit'>
                    <Shield className='h-3 w-3' />
                    {guardName}
                </Badge>
            )
        },
    },
    {
        accessorKey: 'permissions',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='الصلاحيات' icon={<Lock className='h-4 w-4' />} />
        ),
        meta: { className: 'ps-1', tdClassName: 'ps-4' },
        cell: ({ row }) => {
            const permissions = row.original.permissions || []
            const permissionCount = permissions.length

            if (permissionCount === 0) {
                return (
                    <div className='flex items-center gap-2 text-muted-foreground'>
                        <Lock className='h-3.5 w-3.5 opacity-50' />
                        <span className='text-sm'>لا توجد صلاحيات</span>
                    </div>
                )
            }

            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className='flex flex-wrap gap-1.5 cursor-help'>
                                <Badge variant='secondary' className='text-xs flex items-center gap-1'>
                                    <Lock className='h-3 w-3' />
                                    {permissionCount} صلاحية
                                </Badge>
                                {permissions.slice(0, 2).map((permission) => (
                                    <Badge key={permission.id} variant='outline' className='text-xs'>
                                        {permission.name}
                                    </Badge>
                                ))}
                                {permissions.length > 2 && (
                                    <Badge variant='outline' className='text-xs'>
                                        +{permissions.length - 2}
                                    </Badge>
                                )}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className='max-w-sm'>
                            <div className='space-y-1'>
                                <p className='font-semibold text-xs mb-1'>جميع الصلاحيات:</p>
                                <div className='flex flex-wrap gap-1'>
                                    {permissions.map((permission) => (
                                        <Badge key={permission.id} variant='outline' className='text-xs'>
                                            {permission.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
        enableSorting: false,
    },
    {
        accessorKey: 'users_count',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='المستخدمين' icon={<Users className='h-4 w-4' />} />
        ),
        meta: { className: 'ps-1', tdClassName: 'ps-4' },
        cell: ({ row }) => {
            const usersCount = row.getValue('users_count') as number
            return (
                <div className='flex items-center gap-2'>
                    <div className='flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30'>
                        <Users className='h-3.5 w-3.5 text-blue-600 dark:text-blue-400' />
                    </div>
                    <span className='text-sm font-medium'>{usersCount}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='تاريخ الإنشاء' icon={<Calendar className='h-4 w-4' />} />
        ),
        meta: { className: 'ps-1', tdClassName: 'ps-4' },
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at'))
            const formattedDate = date.toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            })
            const formattedTime = date.toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit',
            })
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className='flex items-center gap-2 text-sm text-muted-foreground cursor-help'>
                                <Calendar className='h-3.5 w-3.5' />
                                <span>{formattedDate}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{formattedDate} - {formattedTime}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]
