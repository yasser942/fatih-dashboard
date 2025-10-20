import { useQuery } from '@apollo/client/react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { RolesDialogs } from './components/roles-dialogs'
import { RolesPrimaryButtons } from './components/roles-primary-buttons'
import { RolesProvider } from './components/roles-provider'
import { RolesTable } from './components/roles-table'
import { ROLES_QUERY } from './graphql/queries'
import { type Role } from './data/schema'

type RolesQueryResponse = {
    roles: Role[]
}

export function Roles() {
    const { data, loading, error, refetch } = useQuery<RolesQueryResponse>(ROLES_QUERY, {
        errorPolicy: 'all',
    })

    if (loading) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <div className='text-center'>
                    <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
                    <p className='mt-2 text-sm text-muted-foreground'>Loading roles...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <div className='text-center'>
                    <p className='text-destructive'>Error loading roles: {error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <RolesProvider refetch={refetch}>
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
                        <h2 className='text-2xl font-bold tracking-tight'>الأدوار</h2>
                        <p className='text-muted-foreground'>
                            إدارة أدوار المستخدمين وصلاحياتهم
                        </p>
                    </div>
                    <RolesPrimaryButtons />
                </div>
                <RolesTable data={data?.roles || []} />
            </Main>

            <RolesDialogs />
        </RolesProvider>
    )
}
