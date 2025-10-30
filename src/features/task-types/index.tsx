import { useQuery } from '@apollo/client/react'
import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TaskTypesDialogs } from './components/task-types-dialogs'
import { TaskTypesPrimaryButtons } from './components/task-types-primary-buttons'
import { TaskTypesProvider } from './components/task-types-provider'
import { TaskTypesTable } from './components/task-types-table'
import { TASK_TYPES_QUERY } from './graphql/queries'
import { type TaskType } from './data/schema'
import { Settings2, CheckCircle2, XCircle } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'

const route = getRouteApi('/_authenticated/task-types/')

type TaskTypesQueryResponse = {
    taskTypes: {
        data: TaskType[]
        paginatorInfo: {
            count: number
            currentPage: number
            firstItem: number
            hasMorePages: boolean
            lastItem: number
            perPage: number
            total: number
        }
    }
}

export function TaskTypes() {
    const search = route.useSearch()
    const page = search.page ?? 1
    const pageSize = search.pageSize ?? 15
    const searchTerm = search.search ?? ''

    const { data, loading, error, refetch } = useQuery<TaskTypesQueryResponse>(TASK_TYPES_QUERY, {
        errorPolicy: 'all',
        variables: { first: pageSize, page: page, search: searchTerm },
        notifyOnNetworkStatusChange: false,
        fetchPolicy: 'cache-and-network',
    })

    useEffect(() => {
        if (error) {
            console.error('Task Types query error:', error)
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                toast.error(error.graphQLErrors[0].message)
            } else {
                toast.error('فشل في تحميل قائمة أنواع المهام')
            }
        }
    }, [error])

    const taskTypes = data?.taskTypes?.data || []
    const paginatorInfo = data?.taskTypes?.paginatorInfo
    const activeCount = taskTypes.filter((tt) => tt.status === 'Active').length
    const inactiveCount = taskTypes.filter((tt) => tt.status === 'Inactive').length

    if (loading && !data) {
        return (
            <TaskTypesProvider refetch={refetch}>
                <Header fixed>
                    <Search />
                    <div className='ms-auto flex items-center space-x-4'>
                        <ThemeSwitch />
                        <ConfigDrawer />
                        <ProfileDropdown />
                    </div>
                </Header>
                <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                    <div className='flex h-[60vh] items-center justify-center'>
                        <div className='flex flex-col items-center gap-3'>
                            <Spinner className="text-primary" size={48} />
                            <p className='text-sm text-muted-foreground'>جاري تحميل أنواع المهام...</p>
                        </div>
                    </div>
                </Main>
            </TaskTypesProvider>
        )
    }

    return (
        <TaskTypesProvider refetch={refetch}>
            <Header fixed>
                <Search />
                <div className='ms-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-4'>
                    <div className='space-y-1'>
                        <div className='flex items-center gap-2'>
                            <Settings2 className='h-6 w-6 text-primary' />
                            <h2 className='text-3xl font-bold tracking-tight'>أنواع المهام</h2>
                        </div>
                        <p className='text-muted-foreground'>
                            إدارة أنواع المهام المتاحة في النظام وإعداداتها
                        </p>
                    </div>
                    <TaskTypesPrimaryButtons />
                </div>

                {paginatorInfo && paginatorInfo.total > 0 && (
                    <div className='grid gap-4 md:grid-cols-3'>
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>إجمالي الأنواع</CardTitle>
                                <Settings2 className='h-4 w-4 text-muted-foreground' />
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>{paginatorInfo.total}</div>
                                <p className='text-xs text-muted-foreground'>نوع مهمة</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>النشطة</CardTitle>
                                <CheckCircle2 className='h-4 w-4 text-green-600' />
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold text-green-600'>{activeCount}</div>
                                <p className='text-xs text-muted-foreground'>نوع نشط</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>غير النشطة</CardTitle>
                                <XCircle className='h-4 w-4 text-red-600' />
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold text-red-600'>{inactiveCount}</div>
                                <p className='text-xs text-muted-foreground'>نوع غير نشط</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <TaskTypesTable
                    data={taskTypes}
                    paginatorInfo={paginatorInfo}
                    loading={loading}
                    error={error}
                />
            </Main>

            <TaskTypesDialogs />
        </TaskTypesProvider>
    )
}

export default TaskTypes

