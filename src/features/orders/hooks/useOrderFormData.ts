import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client/core'

const USERS_SEARCH_QUERY = gql`
  query UsersSearch($search: String) {
    users(search: $search, first: 10) {
      data {
        id
        name
        email
      }
    }
  }
`

const BRANCHES_QUERY = gql`
  query Branches {
    branches {
      id
      name
    }
  }
`

const CURRENCIES_QUERY = gql`
  query Currencies {
    currencies {
      id
      name
      code
    }
  }
`

export function useOrderFormData() {
  // Load branches and currencies (these are typically small datasets)
  const { data: branchesData, loading: branchesLoading, error: branchesError } = useQuery(BRANCHES_QUERY, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: false,
    errorPolicy: 'all',
  })

  const { data: currenciesData, loading: currenciesLoading, error: currenciesError } = useQuery(CURRENCIES_QUERY, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: false,
    errorPolicy: 'all',
  })

  return {
    branchesData,
    branchesLoading,
    branchesError,
    currenciesData,
    currenciesLoading,
    currenciesError,
    // Computed loading state
    isLoading: branchesLoading || currenciesLoading,
    // Computed error state
    hasError: branchesError || currenciesError,
  }
}

export function useUsersSearch(searchTerm: string = '') {
  const { data: usersDataRaw, loading: usersLoading, error: usersError } = useQuery(USERS_SEARCH_QUERY, {
    variables: {
      search: searchTerm,
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: false,
    errorPolicy: 'all',
  })
  // Backend returns { users: { data: [...] } }
  const usersData = usersDataRaw && usersDataRaw.users ? { users: usersDataRaw.users.data } : { users: [] };
  return {
    usersData,
    usersLoading,
    usersError,
  }
}
