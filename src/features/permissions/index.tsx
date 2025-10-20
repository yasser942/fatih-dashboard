import { useQuery } from '@apollo/client/react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { PermissionsDialogs } from './components/permissions-dialogs'
import { PermissionsPrimaryButtons } from './components/permissions-primary-buttons'
import { PermissionsProvider } from './components/permissions-provider'
import { PermissionsTable } from './components/permissions-table'
import { PERMISSIONS_QUERY } from './graphql/queries'
import { type Permission } from './data/schema'

type PermissionsQueryResponse = {
    permissions: Permission[]
}

export function Permissions() {
    const { data, loading, error, refetch } = useQuery<PermissionsQueryResponse>(PERMISSIONS_QUERY, {
        errorPolicy: 'all',
    })

    if (loading) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <div className='text-center'>
                    <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
                    <p className='mt-2 text-sm text-muted-foreground'>Loading permissions...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <div className='text-center'>
                    <p className='text-destructive'>Error loading permissions: {error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <PermissionsProvider refetch={refetch}>
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
                        <h2 className='text-2xl font-bold tracking-tight'>الصلاحيات</h2>
                        <p className='text-muted-foreground'>
                            إدارة صلاحيات النظام وتعييناتها
                        </p>
                    </div>
                    <PermissionsPrimaryButtons />
                </div>
                <PermissionsTable data={data?.permissions || []} />
            </Main>

            <PermissionsDialogs />
        </PermissionsProvider>
    )
}
