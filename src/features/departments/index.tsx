import { useQuery } from '@apollo/client/react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { DepartmentsDialogs } from './components/departments-dialogs'
import { DepartmentsPrimaryButtons } from './components/departments-primary-buttons'
import { DepartmentsProvider } from './components/departments-provider'
import { DepartmentsTable } from './components/departments-table'
import { DEPARTMENTS_QUERY } from './graphql/queries'
import { type DepartmentsPaginatedResponse } from './data/schema'

type DepartmentsQueryResponse = {
    departments: DepartmentsPaginatedResponse
}

export function Departments() {
    const { data, loading, error, refetch } = useQuery<DepartmentsQueryResponse>(DEPARTMENTS_QUERY, {
        errorPolicy: 'all',
    })

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Spinner className="text-primary" size={48} />
                    <p className="text-sm text-muted-foreground">جاري تحميل الأقسام...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive">خطأ في تحميل الأقسام: {error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <DepartmentsProvider refetch={refetch}>
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
                        <h2 className="text-2xl font-bold tracking-tight">الأقسام</h2>
                        <p className="text-muted-foreground">إدارة أقسام الشركة</p>
                    </div>
                    <DepartmentsPrimaryButtons />
                </div>
                <DepartmentsTable data={data?.departments?.data || []} />
            </Main>

            <DepartmentsDialogs />
        </DepartmentsProvider>
    )
}




