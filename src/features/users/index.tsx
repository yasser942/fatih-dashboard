import { useQuery } from '@apollo/client/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersDialogs } from './components/users-dialogs'
import { USERS_QUERY } from './graphql/queries'
import { type User } from './data/schema'

const route = getRouteApi('/_authenticated/users/')

type UsersQueryResponse = {
  users: {
    data: User[]
    paginatorInfo: {
      count: number
      currentPage: number
      hasMorePages: boolean
      perPage: number
      total: number
    }
  }
}

function UsersPageContent() {
  const search = route.useSearch()
  const page = search.page ?? 1
  const pageSize = search.pageSize ?? 15
  const searchTerm = search.search ?? ''

  const { data, loading, error, refetch } = useQuery<UsersQueryResponse>(USERS_QUERY, {
    errorPolicy: 'all',
    variables: { first: pageSize, page: page, search: searchTerm },
    notifyOnNetworkStatusChange: false,
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (error) {
      console.error('Users query error:', error)
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        toast.error(error.graphQLErrors[0].message)
      } else {
        toast.error('فشل في تحميل قائمة المستخدمين')
      }
    }
  }, [error])

  return (
    <UsersProvider refetch={refetch}>
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
          <div className="space-y-1">
            <h2 className='text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text'>
              إدارة المستخدمين
            </h2>
            <p className='text-sm text-muted-foreground'>
              إدارة حسابات المستخدمين والعملاء والموظفين في النظام
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <UsersTable
          data={data?.users?.data || []}
          paginationInfo={data?.users?.paginatorInfo}
          loading={loading}
          error={error}
        />
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}

export default function UsersPage() {
  return <UsersPageContent />
}
