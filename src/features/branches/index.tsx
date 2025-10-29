import { useQuery } from '@apollo/client/react'
import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { BranchesProvider } from './components/branches-provider'
import { BranchesDialogs } from './components/branches-dialogs'
import { BranchesPrimaryButtons } from './components/branches-primary-buttons'
import { BranchesTable } from './components/branches-table'
import { BRANCHES_PAGINATED_QUERY } from './graphql/queries'
import { type Branch } from './data/schema'

const route = getRouteApi('/_authenticated/branches/')

type BranchesPaginatedResponse = {
    branchesPaginated: {
        data: Branch[]
        paginatorInfo: {
            count: number
            currentPage: number
            firstItem: number | null
            hasMorePages: boolean
            lastItem: number | null
            perPage: number
            total: number
        }
    }
}

export function Branches() {
    const search = route.useSearch()

    const { data, loading, error, refetch } = useQuery<BranchesPaginatedResponse>(BRANCHES_PAGINATED_QUERY, {
        variables: {
            first: search.per_page || 10,
            page: search.page || 1,
            search: search.search || undefined,
            status: search.status || undefined,
        },
        errorPolicy: 'all',
    })

    return (
        <BranchesProvider refetch={refetch}>
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
                        <h2 className='text-2xl font-bold tracking-tight'>الفروع</h2>
                        <p className='text-muted-foreground'>إدارة فروع الشركة</p>
                    </div>
                    <BranchesPrimaryButtons />
                </div>
                <BranchesTable
                    data={data?.branchesPaginated.data || []}
                    paginationInfo={data?.branchesPaginated.paginatorInfo}
                    loading={loading}
                    error={error}
                />
            </Main>

            <BranchesDialogs />
        </BranchesProvider>
    )
}


