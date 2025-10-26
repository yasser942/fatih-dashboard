import { useQuery } from '@apollo/client/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { CustomersProvider } from './components/customers-provider'
import { CustomersTable } from './components/customers-table'
import { CustomersPrimaryButtons } from './components/customers-primary-buttons'
import { CustomersDialogs } from './components/customers-dialogs'
import { CUSTOMERS_QUERY } from './graphql/queries'
import { type Customer } from './data/schema'

const route = getRouteApi('/_authenticated/customers/')

type CustomersQueryResponse = {
    customers: {
        data: Customer[]
        paginatorInfo: {
            count: number
            currentPage: number
            hasMorePages: boolean
            perPage: number
            total: number
        }
    }
}

function CustomersPageContent() {
    const search = route.useSearch()
    const page = search.page ?? 1
    const pageSize = search.pageSize ?? 15
    const searchTerm = search.search ?? ''

    const { data, loading, error, refetch } = useQuery<CustomersQueryResponse>(CUSTOMERS_QUERY, {
        errorPolicy: 'all',
        variables: { first: pageSize, page: page, search: searchTerm },
        notifyOnNetworkStatusChange: false, // Prevent re-rendering on network status changes
        fetchPolicy: 'cache-and-network' // Use cache when available, fetch in background
    })

    // Show error message when query fails
    useEffect(() => {
        if (error) {
            console.error('Customers query error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error('فشل في تحميل قائمة العملاء')
            }
        }
    }, [error])

    return (
        <CustomersProvider refetch={refetch}>
            <Header fixed>
                <Search />
                <div className='ms-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>إدارة العملاء</h2>
                        <p className='text-muted-foreground'>
                            إدارة العملاء في النظام
                        </p>
                    </div>
                    <CustomersPrimaryButtons />
                </div>
                <CustomersTable
                    data={data?.customers?.data || []}
                    paginationInfo={data?.customers?.paginatorInfo}
                    loading={loading}
                    error={error}
                />
            </Main>

            <CustomersDialogs />
        </CustomersProvider>
    )
}

export default function CustomersPage() {
    return <CustomersPageContent />
}
