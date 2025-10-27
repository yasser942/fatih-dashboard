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
import { OrdersTable } from './components/orders-table'
import { OrdersProvider } from './components/orders-provider'
import { OrdersPrimaryButtons } from './components/orders-primary-buttons'
import { OrdersDialogs } from './components/orders-dialogs'
import { ORDERS_QUERY } from './graphql/queries'

const route = getRouteApi('/_authenticated/orders/')

function OrdersPageContent() {
    const search = route.useSearch()
    const navigate = route.useNavigate()

    const { data, loading, error, refetch } = useQuery(ORDERS_QUERY, {
        variables: {
            first: search.pageSize || 15,
            page: search.page || 1,
            orderBy: search.orderBy,
            search: search.search,
        },
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
    })

    useEffect(() => {
        if (error) {
            console.error('Orders query error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error('حدث خطأ في تحميل الشحنات')
            }
        }
    }, [error])

    return (
        <OrdersProvider refetch={refetch}>
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
                        <h2 className='text-2xl font-bold tracking-tight'>إدارة الشحنات</h2>
                        <p className='text-muted-foreground'>
                            إدارة الشحنات في النظام
                        </p>
                    </div>
                    <OrdersPrimaryButtons />
                </div>
                <OrdersTable
                    data={data?.orders?.data || []}
                    paginationInfo={data?.orders?.paginatorInfo}
                    loading={loading}
                    error={error}
                />
            </Main>

            <OrdersDialogs />
        </OrdersProvider>
    )
}

export default function OrdersPage() {
    return <OrdersPageContent />
}
