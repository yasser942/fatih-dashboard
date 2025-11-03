import { useQuery } from '@apollo/client/react'
import { getRouteApi } from '@tanstack/react-router'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { ClipboardList } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import { TasksProvider } from './components/tasks-provider'
import { TasksTable } from './components/tasks-table'
import { GET_TASKS_QUERY } from './graphql/queries'
import { type Task } from './data/schema'

const route = getRouteApi('/_authenticated/tasks/')

type TasksQueryResponse = {
  tasks: {
    data: Task[]
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

export function Tasks() {
  const search = route.useSearch()
  const page = search.page ?? 1
  const pageSize = search.pageSize ?? 15
  const searchTerm = search.search ?? ''

  const { data, loading, error, refetch } = useQuery<TasksQueryResponse>(GET_TASKS_QUERY, {
    errorPolicy: 'all',
    variables: { first: pageSize, page: page, search: searchTerm },
    notifyOnNetworkStatusChange: false,
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (error) {
      console.error('Tasks query error:', error)
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        toast.error(error.graphQLErrors[0].message)
      } else {
        toast.error('فشل في تحميل قائمة المهام')
      }
    }
  }, [error])

  const tasks = data?.tasks?.data || []
  const paginatorInfo = data?.tasks?.paginatorInfo

  if (loading && !data) {
    return (
      <TasksProvider refetch={refetch}>
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
              <p className='text-sm text-muted-foreground'>جاري تحميل المهام...</p>
            </div>
          </div>
        </Main>
      </TasksProvider>
    )
  }

  return (
    <TasksProvider refetch={refetch}>
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
              <ClipboardList className='h-6 w-6 text-primary' />
              <h2 className='text-3xl font-bold tracking-tight'>المهام</h2>
            </div>
            <p className='text-muted-foreground'>
              إدارة المهام وتعيينها للمستخدمين والمركبات
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>

        <TasksTable
          data={tasks}
          paginationInfo={paginatorInfo}
          loading={loading}
          error={error}
        />
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}

export default Tasks
