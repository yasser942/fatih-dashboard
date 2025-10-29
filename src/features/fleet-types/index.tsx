import { useQuery } from '@apollo/client/react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { FleetTypesDialogs } from './components/fleet-types-dialogs'
import { FleetTypesPrimaryButtons } from './components/fleet-types-primary-buttons'
import { FleetTypesProvider } from './components/fleet-types-provider'
import { FleetTypesTable } from './components/fleet-types-table'
import { GET_FLEET_TYPES } from './graphql/queries'
import { type FleetType } from './data/schema'

type FleetTypesQueryResponse = {
    fleetTypes: FleetType[]
}

export function FleetTypes() {
    const { data, loading, error, refetch } = useQuery<FleetTypesQueryResponse>(GET_FLEET_TYPES, {
        errorPolicy: 'all',
    })

    if (loading) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <div className='flex flex-col items-center gap-3'>
                    <Spinner className="text-primary" size={48} />
                    <p className='text-sm text-muted-foreground'>جاري تحميل أنواع الأساطيل...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <div className='text-center'>
                    <p className='text-destructive'>خطأ في تحميل أنواع الأساطيل: {error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <FleetTypesProvider refetch={refetch}>
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
                        <h2 className='text-2xl font-bold tracking-tight'>أنواع الأساطيل</h2>
                        <p className='text-muted-foreground'>
                            إدارة أنواع الأساطيل المتاحة في النظام
                        </p>
                    </div>
                    <FleetTypesPrimaryButtons />
                </div>
                <FleetTypesTable data={data?.fleetTypes || []} />
            </Main>

            <FleetTypesDialogs />
        </FleetTypesProvider>
    )
}

export default FleetTypes
