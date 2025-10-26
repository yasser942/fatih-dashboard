import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar, DataTableBulkActions } from '@/components/data-table'
import { type Customer } from '../data/schema'
import { customersColumns as columns } from './customers-columns'
import { useCustomers } from './customers-provider'
import { DataTableBulkActions as CustomersBulkActions } from './data-table-bulk-actions'

const route = getRouteApi('/_authenticated/customers/')

type DataTableProps = {
    data: Customer[]
    paginationInfo?: {
        count: number
        currentPage: number
        hasMorePages: boolean
        perPage: number
        total: number
    }
    loading?: boolean
    error?: any
}

export function CustomersTable({ data, paginationInfo, loading, error }: DataTableProps) {
    const [rowSelection, setRowSelection] = useState({})
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const { setCurrentRow, setOpen } = useCustomers()

    const { globalFilter, onGlobalFilterChange, columnFilters, onColumnFiltersChange, pagination, onPaginationChange } =
        useTableUrlState({
            search: route.useSearch(),
            navigate: route.useNavigate(),
            globalFilter: {
                enabled: true,
                key: 'search',
                trim: true,
            },
        })

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnVisibility, rowSelection, columnFilters, globalFilter, pagination },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange,
        onPaginationChange,
        getCoreRowModel: getCoreRowModel(),
        // Disable client-side filtering and pagination since we're using server-side
        manualPagination: true,
        manualFiltering: true,
        pageCount: paginationInfo ? Math.ceil(paginationInfo.total / paginationInfo.perPage) : -1,
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    useEffect(() => {
        setRowSelection({})
    }, [data])

    return (
        <div className="space-y-4">
            <DataTableToolbar
                table={table}
                searchPlaceholder="البحث في العملاء..."
                onGlobalFilterChange={onGlobalFilterChange}
            />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className={cn(header.column.columnDef.meta?.className)}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                        <span className="ml-2">جاري التحميل...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-red-500">
                                    خطأ في تحميل البيانات: {error.message}
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className="hover:bg-muted/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className={cn(cell.column.columnDef.meta?.tdClassName)}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    لم يتم العثور على عملاء.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <CustomersBulkActions table={table} />
            )}
        </div>
    )
}
