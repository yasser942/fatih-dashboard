import { useQuery } from '@apollo/client/react'
import { Lock, UserCog, Users, Shield, AlertCircle } from 'lucide-react'
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

    const permissions = data?.permissions || []

    // Calculate statistics
    const totalPermissions = permissions.length
    const totalUsers = permissions.reduce((sum, perm) => sum + (perm.users_count || 0), 0)
    const totalRoles = permissions.reduce((sum, perm) => sum + (perm.roles_count || 0), 0)
    const avgRolesPerPermission = totalPermissions > 0 ? Math.round(
        permissions.reduce((sum, perm) => sum + (perm.roles?.length || 0), 0) / totalPermissions
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
                        <p className='text-lg font-medium'>جاري تحميل الصلاحيات</p>
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

                {/* Statistics Cards */}
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    <StatsCard
                        title='إجمالي الصلاحيات'
                        value={totalPermissions}
                        icon={Lock}
                        description='عدد الصلاحيات المتاحة'
                        colorClass='bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                    />
                    <StatsCard
                        title='الأدوار المعينة'
                        value={totalRoles}
                        icon={UserCog}
                        description='الأدوار التي تستخدم الصلاحيات'
                        colorClass='bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    />
                    <StatsCard
                        title='إجمالي المستخدمين'
                        value={totalUsers}
                        icon={Users}
                        description='المستخدمون مع صلاحيات'
                        colorClass='bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    />
                    <StatsCard
                        title='متوسط الأدوار'
                        value={avgRolesPerPermission}
                        icon={Shield}
                        description='أدوار لكل صلاحية'
                        colorClass='bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                    />
                </div>

                <PermissionsTable data={permissions} />
            </Main>

            <PermissionsDialogs />
        </PermissionsProvider>
    )
}
