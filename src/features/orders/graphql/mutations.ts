import { gql } from '@apollo/client/core'

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
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

export const UPDATE_ORDER_MUTATION = gql`
  mutation UpdateOrder($id: ID!, $input: UpdateOrderInput!) {
    updateOrder(id: $id, input: $input) {
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
      updated_at
    }
  }
`

export const DELETE_ORDER_MUTATION = gql`
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id) {
      id
    }
  }
`

export const BULK_DELETE_ORDERS_MUTATION = gql`
  mutation BulkDeleteOrders($ids: [ID!]!) {
    bulkDeleteOrders(ids: $ids) {
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

export const BULK_UPDATE_ORDERS_STATUS_MUTATION = gql`
  mutation BulkUpdateOrdersStatus($ids: [ID!]!, $status: OrderStatus!) {
    bulkUpdateOrdersStatus(ids: $ids, status: $status) {
      id
      qr_code
      status
      transfer_date
      delivery_date
      updated_at
    }
  }
`
