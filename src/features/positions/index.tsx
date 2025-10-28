import { useQuery } from '@apollo/client/react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { PositionsDialogs } from './components/positions-dialogs'
import { PositionsPrimaryButtons } from './components/positions-primary-buttons'
import { PositionsProvider } from './components/positions-provider'
import { PositionsTable } from './components/positions-table'
import { POSITIONS_QUERY } from './graphql/queries'
import { type PositionsPaginatedResponse } from './data/schema'

type PositionsQueryResponse = {
    positions: PositionsPaginatedResponse
}

export function Positions() {
    const { data, loading, error, refetch } = useQuery<PositionsQueryResponse>(POSITIONS_QUERY, {
        errorPolicy: 'all',
    })

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="mt-2 text-sm text-muted-foreground">جاري تحميل الوظائف...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive">خطأ في تحميل الوظائف: {error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <PositionsProvider refetch={refetch}>
            <Header fixed>
                <Search />
                <div className="ms-auto flex items-center space-x-4">
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
                <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">الوظائف</h2>
                        <p className="text-muted-foreground">إدارة الوظائف في الشركة</p>
                    </div>
                    <PositionsPrimaryButtons />
                </div>
                <PositionsTable data={data?.positions?.data || []} />
            </Main>

            <PositionsDialogs />
        </PositionsProvider>
    )
}




