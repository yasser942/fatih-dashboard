import { gql } from '@apollo/client'

export const CURRENCIES_QUERY = gql`
  query Currencies {
    currencies {
      id
      name
      symbol
      code
      is_active
      created_at
      updated_at
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
      created_at
      updated_at
    }
  }
`

