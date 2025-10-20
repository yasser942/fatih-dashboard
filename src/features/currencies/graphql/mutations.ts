import { gql } from '@apollo/client'

export const CREATE_CURRENCY_MUTATION = gql`
  mutation CreateCurrency($input: CreateCurrencyInput!) {
    createCurrency(input: $input) {
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

export const UPDATE_CURRENCY_MUTATION = gql`
  mutation UpdateCurrency($id: ID!, $input: UpdateCurrencyInput!) {
    updateCurrency(id: $id, input: $input) {
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

export const DELETE_CURRENCY_MUTATION = gql`
  mutation DeleteCurrency($id: ID!) {
    deleteCurrency(id: $id) {
      id
      name
      symbol
      code
    }
  }
`

