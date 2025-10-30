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
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { type User } from '../data/schema'
import { usersColumns as columns } from './users-columns'
import { useUsers } from './users-provider'
import { DataTableBulkActions as UsersBulkActions } from './data-table-bulk-actions'

const route = getRouteApi('/_authenticated/users/')

type DataTableProps = {
  data: User[]
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

export function UsersTable({ data, paginationInfo, loading, error }: DataTableProps) {
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const { setCurrentRow, setOpen } = useUsers()

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
    <div className='space-y-4'>
      <DataTableToolbar table={table}>
        {table.getFilteredSelectedRowModel().rows.length > 0 && <UsersBulkActions table={table} />}
      </DataTableToolbar>
      <div className='rounded-lg border shadow-sm overflow-hidden'>
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-muted/50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan} className="font-semibold">
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
              <TableRow>
                <TableCell colSpan={columns.length} className='h-32 text-center'>
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Spinner className="text-primary" size={40} />
                    <p className="text-sm text-muted-foreground">جاري تحميل البيانات...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-32 text-center'>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="text-4xl">⚠️</div>
                    <p className="text-red-600 font-medium">حدث خطأ أثناء تحميل البيانات</p>
                    <p className="text-sm text-muted-foreground">يرجى المحاولة مرة أخرى</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'transition-colors hover:bg-muted/30',
                    row.getIsSelected() && 'bg-primary/5 hover:bg-primary/10'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-32 text-center'>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="text-4xl">📭</div>
                    <p className="font-medium text-muted-foreground">لا توجد نتائج</p>
                    <p className="text-sm text-muted-foreground">ابدأ بإضافة مستخدم جديد</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {paginationInfo && <DataTablePagination table={table} paginationInfo={paginationInfo} />}
    </div>
  )
}
