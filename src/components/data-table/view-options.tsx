import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

type DataTableViewOptionsProps<TData> = {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='ms-auto hidden h-8 lg:flex'
        >
          <MixerHorizontalIcon className='size-4' />
          عرض
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[150px]'>
        <DropdownMenuLabel>تبديل الأعمدة</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== 'undefined' && column.getCanHide()
          )
          .map((column) => {
            // Get the header text from the column definition
            let headerText = column.id

            if (typeof column.columnDef.header === 'string') {
              headerText = column.columnDef.header
            } else if (typeof column.columnDef.header === 'function') {
              // For custom header functions, try to extract text from common patterns
              // This is a fallback for columns with custom JSX headers
              const headerMap: Record<string, string> = {
                'Location_Pcode': 'كود الموقع',
                'name': 'اسم العملة',
                'symbol': 'الرمز',
                'code': 'الكود',
                'is_active': 'الحالة',
                'created_at': 'تاريخ الإنشاء',
                'updated_at': 'تاريخ التحديث',
                'location_type': 'نوع الموقع',
                'country_ar': 'البلد',
                'governorate_ar': 'المحافظة',
                'district_ar': 'المنطقة',
                'village_town_ar': 'القرية/المدينة',
              }
              headerText = headerMap[column.id] || column.id
            }

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className='capitalize'
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {headerText}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
