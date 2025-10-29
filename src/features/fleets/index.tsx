import { useQuery } from '@apollo/client/react'
import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { FleetsProvider } from './components/fleets-provider'
import { FleetsDialogs } from './components/fleets-dialogs'
import { FleetsPrimaryButtons } from './components/fleets-primary-buttons'
import { FleetsTable } from './components/fleets-table'
import { FLEETS_QUERY } from './graphql/queries'
import { type Fleet } from './data/schema'

const route = getRouteApi('/_authenticated/fleets/')

type FleetsQueryResponse = {
    fleets: {
        data: Fleet[]
        paginatorInfo: {
            count: number
            currentPage: number
            hasMorePages: boolean
            perPage: number
            total: number
        }
    }
}

export function Fleets() {
    const search = route.useSearch()
    const page = search.page ?? 1
    const pageSize = search.pageSize ?? 15

    const { data, loading, error, refetch } = useQuery<FleetsQueryResponse>(FLEETS_QUERY, {
        errorPolicy: 'all',
        variables: { first: pageSize, page: page }
    })

    if (loading) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <div className='flex flex-col items-center gap-3'>
                    <Spinner className="text-primary" size={48} />
                    <p className='text-sm text-muted-foreground'>جاري تحميل المركبات...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <div className='text-center'>
                    <p className='text-destructive'>خطأ في تحميل المركبات: {error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <FleetsProvider refetch={refetch}>
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
                        <h2 className='text-2xl font-bold tracking-tight'>المركبات</h2>
                        <p className='text-muted-foreground'>إدارة أسطول المركبات</p>
                    </div>
                    <FleetsPrimaryButtons />
                </div>
                <FleetsTable
                    data={data?.fleets?.data || []}
                    paginationInfo={data?.fleets?.paginatorInfo}
                />
            </Main>

            <FleetsDialogs />
        </FleetsProvider>
    )
}


