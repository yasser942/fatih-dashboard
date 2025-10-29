import { useQuery } from '@apollo/client/react'
import { UserCog, Lock, Users, Shield, AlertCircle } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { StatsCard } from '@/components/stats-card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
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

    const roles = data?.roles || []

    // Calculate statistics
    const totalRoles = roles.length
    const totalUsers = roles.reduce((sum, role) => sum + (role.users_count || 0), 0)
    const totalPermissions = new Set(roles.flatMap(role => role.permissions?.map(p => p.id) || [])).size
    const avgPermissionsPerRole = totalRoles > 0 ? Math.round(
        roles.reduce((sum, role) => sum + (role.permissions?.length || 0), 0) / totalRoles
    ) : 0

    if (loading) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='relative'>
                        <div className='h-16 w-16 rounded-full border-4 border-primary/20' />
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <Spinner className='text-primary' size={40} />
                        </div>
                    </div>
                    <div className='text-center'>
                        <p className='text-lg font-medium'>جاري تحميل الأدوار</p>
                        <p className='text-sm text-muted-foreground'>الرجاء الانتظار...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex h-screen items-center justify-center p-6'>
                <div className='max-w-md w-full'>
                    <Alert variant='destructive'>
                        <AlertCircle className='h-4 w-4' />
                        <AlertTitle>خطأ في تحميل البيانات</AlertTitle>
                        <AlertDescription className='mt-2'>
                            <p className='mb-3'>{error.message}</p>
                            <Button
                                onClick={() => refetch()}
                                variant='outline'
                                size='sm'
                                className='mt-2'
                            >
                                إعادة المحاولة
                            </Button>
                        </AlertDescription>
                    </Alert>
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

                {/* Statistics Cards */}
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    <StatsCard
                        title='إجمالي الأدوار'
                        value={totalRoles}
                        icon={UserCog}
                        description='عدد الأدوار المتاحة'
                        colorClass='bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    />
                    <StatsCard
                        title='إجمالي المستخدمين'
                        value={totalUsers}
                        icon={Users}
                        description='المستخدمون مع أدوار'
                        colorClass='bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    />
                    <StatsCard
                        title='الصلاحيات المستخدمة'
                        value={totalPermissions}
                        icon={Lock}
                        description='صلاحيات فريدة مُعينة'
                        colorClass='bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                    />
                    <StatsCard
                        title='متوسط الصلاحيات'
                        value={avgPermissionsPerRole}
                        icon={Shield}
                        description='صلاحيات لكل دور'
                        colorClass='bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                    />
                </div>

                <RolesTable data={roles} />
            </Main>

            <RolesDialogs />
        </RolesProvider>
    )
}
