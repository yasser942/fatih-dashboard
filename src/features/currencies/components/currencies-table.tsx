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
import { CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { type Currency } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { currenciesColumns as columns } from './currencies-columns'
import { useCurrencies } from './currencies-provider'

const route = getRouteApi('/_authenticated/currencies/')

type DataTableProps = {
    data: Currency[]
}

const statusOptions = [
    {
        label: 'نشط',
        value: 'true',
        icon: CheckCircle,
    },
    {
        label: 'غير نشط',
        value: 'false',
        icon: XCircle,
    },
]

export function CurrenciesTable({ data }: DataTableProps) {
    // Local UI-only states
    const [rowSelection, setRowSelection] = useState({})
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    // Get currencies context for edit functionality
    const { setCurrentRow, setOpen } = useCurrencies()

    // Synced with URL states
    const {
        globalFilter,
        onGlobalFilterChange,
        columnFilters,
        onColumnFiltersChange,
        pagination,
        onPaginationChange,
    } = useTableUrlState({
        search: route.useSearch(),
        navigate: route.useNavigate(),
    })

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            globalFilter,
            pagination,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange,
        onPaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    // Reset row selection when data changes
    useEffect(() => {
        setRowSelection({})
    }, [data])

    return (
        <>
            <div className='space-y-4'>
                <DataTableToolbar
                    table={table}
                    searchPlaceholder='البحث في العملات...'
                    onGlobalFilterChange={onGlobalFilterChange}
                    filters={[
                        {
                            columnId: 'is_active',
                            title: 'الحالة',
                            options: statusOptions,
                        },
                    ]}
                />
                <div className='rounded-md border'>
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className={cn(
                                                    header.column.columnDef.meta?.className
                                                )}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => {
                                            setCurrentRow(row.original)
                                            setOpen('update')
                                        }}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className={cn(
                                                    cell.column.columnDef.meta?.tdClassName
                                                )}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className='h-24 text-center'
                                    >
                                        لم يتم العثور على عملات.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <DataTablePagination table={table} />
            </div>
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <DataTableBulkActions table={table} />
            )}
        </>
    )
}
