import { gql } from '@apollo/client'

export const CURRENCIES_QUERY = gql`
  query Currencies {
    currencies {
      id
      name
      symbol
      code
      is_active
    }
  }
`

export const CURRENCY_QUERY = gql`
  query Currency($id: ID!) {
    currency(id: $id) {
      id
      name
      symbol
      code
      is_active
    }
  }
`

