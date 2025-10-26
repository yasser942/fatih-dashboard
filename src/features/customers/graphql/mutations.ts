import { gql } from '@apollo/client/core'

export const CREATE_CUSTOMER_MUTATION = gql`
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      id
      customer_type
      market_name
      user_id
      user {
        id
        name
        email
      }
      status
      created_at
      updated_at
    }
  }
`

export const UPDATE_CUSTOMER_MUTATION = gql`
  mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      id
      customer_type
      market_name
      user_id
      user {
        id
        name
        email
      }
      status
      updated_at
    }
  }
`

export const DELETE_CUSTOMER_MUTATION = gql`
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id) {
      id
    }
  }
`

export const BULK_DELETE_CUSTOMERS_MUTATION = gql`
  mutation BulkDeleteCustomers($ids: [ID!]!) {
    bulkDeleteCustomers(ids: $ids) {
      id
      customer_type
      market_name
      user_id
      user {
        id
        name
        email
      }
      status
      created_at
      updated_at
    }
  }
`
