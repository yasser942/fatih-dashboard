import { useQuery } from '@apollo/client/react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { LocationMastersDialogs } from './components/location-masters-dialogs'
import { LocationMastersPrimaryButtons } from './components/location-masters-primary-buttons'
import { LocationMastersProvider } from './components/location-masters-provider'
import { LocationMastersTable } from './components/location-masters-table'
import { LOCATION_MASTERS_QUERY } from './graphql/queries'
import { type LocationMaster } from './data/schema'

type LocationMastersQueryResponse = {
    locationMasters: LocationMaster[]
}

export function LocationMasters() {
    const { data, loading, error, refetch } = useQuery<LocationMastersQueryResponse>(LOCATION_MASTERS_QUERY, {
        errorPolicy: 'all',
    })

    if (loading) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <div className='text-center'>
                    <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
                    <p className='mt-2 text-sm text-muted-foreground'>جاري تحميل المواقع...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <div className='text-center'>
                    <p className='text-destructive'>خطأ في تحميل المواقع: {error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <LocationMastersProvider refetch={refetch}>
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
                        <h2 className='text-2xl font-bold tracking-tight'>إدارة المواقع</h2>
                        <p className='text-muted-foreground'>
                            إدارة المواقع المتاحة في النظام
                        </p>
                    </div>
                    <LocationMastersPrimaryButtons />
                </div>
                <LocationMastersTable data={data?.locationMasters || []} />
            </Main>

            <LocationMastersDialogs />
        </LocationMastersProvider>
    )
}
