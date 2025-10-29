import { useQuery } from '@apollo/client/react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { CurrenciesDialogs } from './components/currencies-dialogs'
import { CurrenciesPrimaryButtons } from './components/currencies-primary-buttons'
import { CurrenciesProvider } from './components/currencies-provider'
import { CurrenciesTable } from './components/currencies-table'
import { CURRENCIES_QUERY } from './graphql/queries'
import { type Currency } from './data/schema'

type CurrenciesQueryResponse = {
    currencies: Currency[]
}

export function Currencies() {
    const { data, loading, error, refetch } = useQuery<CurrenciesQueryResponse>(CURRENCIES_QUERY, {
        errorPolicy: 'all',
    })

    if (loading) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <div className='flex flex-col items-center gap-3'>
                    <Spinner className="text-primary" size={48} />
                    <p className='text-sm text-muted-foreground'>جاري تحميل العملات...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <div className='text-center'>
                    <p className='text-destructive'>خطأ في تحميل العملات: {error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <CurrenciesProvider refetch={refetch}>
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
                        <h2 className='text-2xl font-bold tracking-tight'>العملات</h2>
                        <p className='text-muted-foreground'>
                            إدارة العملات المتاحة في النظام
                        </p>
                    </div>
                    <CurrenciesPrimaryButtons />
                </div>
                <CurrenciesTable data={data?.currencies || []} />
            </Main>

            <CurrenciesDialogs />
        </CurrenciesProvider>
    )
}


