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
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, PackageSearch } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { type Order } from '../data/schema'
import { ordersColumns as columns } from './orders-columns'
import { useOrders } from './orders-provider'
import { DataTableBulkActions as OrdersBulkActions } from './data-table-bulk-actions'

const route = getRouteApi('/_authenticated/orders/')

type DataTableProps = {
    data: Order[]
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

export function OrdersTable({ data, paginationInfo, loading, error }: DataTableProps) {

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const { setCurrentRow, setOpen } = useOrders()

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

    // Loading skeleton component
    const TableLoadingSkeleton = () => (
        <>
            {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                    {columns.map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                            <Skeleton className="h-8 w-full" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    )

    return (
        <div className="space-y-4">
            <DataTableToolbar
                table={table}
                searchPlaceholder="البحث في الشحنات برمز QR، اسم المرسل أو المستقبل..."
                searchColumn="qr_code"
            />
            
            <div className="rounded-lg border border-border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-border">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead 
                                            key={header.id} 
                                            className={cn("bg-muted/40 font-semibold", header.column.columnDef.meta?.thClassName)}
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
                        {loading ? (
                            <TableLoadingSkeleton />
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-64">
                                    <Alert variant="destructive" className="max-w-lg mx-auto">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>حدث خطأ أثناء تحميل البيانات</AlertTitle>
                                        <AlertDescription className="mt-2">
                                            {error?.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني.'}
                                        </AlertDescription>
                                    </Alert>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className="hover:bg-muted/50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell 
                                            key={cell.id} 
                                            className={cn("py-3", cell.column.columnDef.meta?.tdClassName)}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-64">
                                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                                        <div className="rounded-full bg-muted p-6">
                                            <PackageSearch className="h-12 w-12 text-muted-foreground" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold">لا توجد شحنات</h3>
                                            <p className="text-sm text-muted-foreground max-w-sm">
                                                {globalFilter 
                                                    ? 'لم يتم العثور على شحنات تطابق معايير البحث. جرب تغيير كلمات البحث.'
                                                    : 'لم يتم إنشاء أي شحنات بعد. ابدأ بإنشاء شحنة جديدة.'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            
            {!loading && !error && data.length > 0 && (
                <DataTablePagination table={table} />
            )}
            
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <OrdersBulkActions table={table} />
            )}
        </div>
    )
}
