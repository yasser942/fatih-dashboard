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
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
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
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { type Task } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { tasksColumns as columns } from './tasks-columns'
import { useTasks } from './tasks-provider'
import { Inbox, AlertCircle } from 'lucide-react'

const route = getRouteApi('/_authenticated/tasks/')

type DataTableProps = {
    data: Task[]
    paginationInfo?: {
        count: number
        currentPage: number
        firstItem: number
        hasMorePages: boolean
        lastItem: number
        perPage: number
        total: number
    }
    loading?: boolean
    error?: any
}

export function TasksTable({ data, paginationInfo, loading, error }: DataTableProps) {
    // Local UI-only states
    const [rowSelection, setRowSelection] = useState({})
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    // Get tasks context for edit functionality
    const { setCurrentRow, setOpen } = useTasks()

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
        globalFilter: {
            enabled: true,
            key: 'search',
            trim: true,
        },
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
        // Disable client-side filtering and pagination since we're using server-side
        manualPagination: true,
        manualFiltering: true,
        pageCount: paginationInfo ? Math.ceil(paginationInfo.total / paginationInfo.perPage) : -1,
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    // Reset row selection when data changes
    useEffect(() => {
        setRowSelection({})
    }, [data])

    // Loading skeleton component
    const TableLoadingSkeleton = () => (
        <>
            {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                    {columns.map((_, colIndex) => (
                        <TableCell key={colIndex} className="h-16">
                            <div className="h-4 w-full animate-pulse rounded bg-muted" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    )

    return (
        <div className="space-y-4">
            <DataTableToolbar table={table} filterKey="search" filterPlaceholder="البحث في المهام..." />
            <div className="rounded-lg border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={cn(
                                                'h-12 font-semibold',
                                                header.column.columnDef.meta?.className
                                            )}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableLoadingSkeleton />
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <AlertCircle className="h-10 w-10 text-destructive" />
                                        <div className="space-y-1">
                                            <p className="font-medium text-destructive">حدث خطأ أثناء تحميل البيانات</p>
                                            <p className="text-sm text-muted-foreground">يرجى المحاولة مرة أخرى</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className="cursor-pointer transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                    onClick={() => {
                                        setCurrentRow(row.original)
                                        setOpen('update')
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cn(
                                                'h-14',
                                                cell.column.columnDef.meta?.tdClassName
                                            )}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="rounded-full bg-muted p-3">
                                            <Inbox className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">لم يتم العثور على مهام</p>
                                            <p className="text-sm text-muted-foreground">
                                                {globalFilter
                                                    ? 'لا توجد نتائج مطابقة لبحثك'
                                                    : 'ابدأ بإضافة مهمة جديدة'}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {paginationInfo && paginationInfo.total > 0 && <DataTablePagination table={table} />}
            {table.getFilteredSelectedRowModel().rows.length > 0 && <DataTableBulkActions table={table} />}
        </div>
    )
}
