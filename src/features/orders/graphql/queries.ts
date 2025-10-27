import { gql } from '@apollo/client/core'

export const ORDERS_QUERY = gql`
  query Orders($first: Int, $page: Int, $orderBy: [OrderByClause!], $search: String) {
    orders(first: $first, page: $page, orderBy: $orderBy, search: $search) {
      data {
        id
        qr_code
        status
        cancellation_reason
        branch_source_id
        branchSource {
          id
          name
        }
        branch_target_id
        branchTarget {
          id
          name
        }
        sender_id
        sender {
          id
          name
          email
        }
        receiver_id
        receiver {
          id
          name
          email
        }
        created_by
        createdBy {
          id
          name
          email
        }
        transfer_date
        delivery_date
        fees_type
        shipping_fees
        fees_currency_id
        feesCurrency {
          id
          name
          code
        }
        cash_on_delivery
        cod_currency_id
        codCurrency {
          id
          name
          code
        }
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

export const ORDER_QUERY = gql`
  query Order($id: ID!) {
    order(id: $id) {
      id
      qr_code
      status
      cancellation_reason
      branch_source_id
      branchSource {
        id
        name
      }
      branch_target_id
      branchTarget {
        id
        name
      }
      sender_id
      sender {
        id
        name
        email
      }
      receiver_id
      receiver {
        id
        name
        email
      }
      created_by
      createdBy {
        id
        name
        email
      }
      transfer_date
      delivery_date
      fees_type
      shipping_fees
      fees_currency_id
      feesCurrency {
        id
        name
        code
      }
      cash_on_delivery
      cod_currency_id
      codCurrency {
        id
        name
        code
      }
      created_at
      updated_at
    }
  }
`
