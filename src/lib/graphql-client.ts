import { environment } from '@/config/environment'
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'

const httpLink = createHttpLink({
  uri: environment.graphqlApiUrl,
})

// Auth link to add token to headers
const authLink = setContext((_, { headers }) => {
  const { auth } = useAuthStore.getState()
  const token = auth.accessToken

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

// Error link for handling GraphQL errors
const errorLink = onError(({ graphQLErrors, networkError }: any) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }: any) => {
      // eslint-disable-next-line no-console
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )

      // Only handle authentication errors globally
      // Let mutations handle validation errors themselves
      if (
        message.includes('Unauthenticated') ||
        message.includes('Unauthorized')
      ) {
        toast.error('Session expired!')
        useAuthStore.getState().auth.reset()
        // Redirect to sign-in will be handled by the router
      } else if (!extensions?.validation) {
        // Only show toast for non-validation errors
        // Validation errors should be handled by the mutation's onError
        toast.error(message)
      }
    })
  }

  if (networkError) {
    // eslint-disable-next-line no-console
    console.error(`[Network error]: ${networkError}`)
    toast.error('Network error occurred')
  }
})

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
})
