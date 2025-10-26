import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './faceted-filter'
import { DataTableViewOptions } from './view-options'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder?: string
  searchKey?: string
  onGlobalFilterChange?: (value: string) => void
  filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'تصفية...',
  searchKey,
  onGlobalFilterChange,
  filters = [],
}: DataTableToolbarProps<TData>) {
  const [searchValue, setSearchValue] = useState('')
  const [isUserTyping, setIsUserTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter

  // Debounced function to update the global filter
  const debouncedUpdateFilter = useCallback((value: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (onGlobalFilterChange) {
        onGlobalFilterChange(value)
      } else {
        table.setGlobalFilter(value)
      }
      setIsUserTyping(false)
    }, 300) // 300ms delay
  }, [onGlobalFilterChange, table])

  // Sync local state with table state when it changes externally, but only if user is not typing
  useEffect(() => {
    if (!searchKey && !isUserTyping) {
      const currentGlobalFilter = table.getState().globalFilter ?? ''
      if (currentGlobalFilter !== searchValue) {
        setSearchValue(currentGlobalFilter)
      }
    }
  }, [table.getState().globalFilter, searchKey, isUserTyping, searchValue])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {searchKey ? (
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className='h-8 w-[150px] lg:w-[250px]'
          />
        ) : (
          <Input
            ref={inputRef}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => {
              const value = event.target.value
              setSearchValue(value)
              setIsUserTyping(true)
              debouncedUpdateFilter(value)
            }}
            onBlur={() => {
              setIsUserTyping(false)
            }}
            onFocus={() => {
              setIsUserTyping(true)
            }}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}
        <div className='flex gap-x-2'>
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) return null
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          })}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter('')
            }}
            className='h-8 px-2 lg:px-3'
          >
            إعادة تعيين
            <Cross2Icon className='ms-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
