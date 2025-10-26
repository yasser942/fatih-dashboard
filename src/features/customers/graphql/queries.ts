import { gql } from '@apollo/client/core'

export const CUSTOMERS_QUERY = gql`
  query Customers($first: Int, $page: Int, $orderBy: [OrderByClause!], $search: String) {
    customers(first: $first, page: $page, orderBy: $orderBy, search: $search) {
      data {
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
      paginatorInfo {
        count
        currentPage
        firstItem
        hasMorePages
        lastItem
        perPage
        total
      }
    }
  }
`

export const CUSTOMER_QUERY = gql`
  query Customer($id: ID!) {
    customer(id: $id) {
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
