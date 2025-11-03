import { gql } from '@apollo/client/core'

export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      order_id
      order {
        id
        qr_code
      }
      user_id
      user {
        id
        name
        email
      }
      vehicle_id
      vehicle {
        id
        plate_number
      }
      from_branch_id
      fromBranch {
        id
        name
      }
      to_branch_id
      toBranch {
        id
        name
      }
      from_customer_id
      fromCustomer {
        id
        market_name
      }
      to_customer_id
      toCustomer {
        id
        market_name
      }
      task_type_id
      taskType {
        id
        task_en
        task_ar
      }
      current_status
      previous_status
      completed_at
      reason_for_cancellation
      is_auto_created
      created_by
      createdBy {
        id
        name
        email
      }
      created_at
      updated_at
    }
  }
`

export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      order_id
      order {
        id
        qr_code
      }
      user_id
      user {
        id
        name
        email
      }
      vehicle_id
      vehicle {
        id
        plate_number
      }
      from_branch_id
      fromBranch {
        id
        name
      }
      to_branch_id
      toBranch {
        id
        name
      }
      from_customer_id
      fromCustomer {
        id
        market_name
      }
      to_customer_id
      toCustomer {
        id
        market_name
      }
      task_type_id
      taskType {
        id
        task_en
        task_ar
      }
      current_status
      previous_status
      completed_at
      reason_for_cancellation
      is_auto_created
      created_by
      createdBy {
        id
        name
        email
      }
      created_at
      updated_at
    }
  }
`

export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`

export const BULK_DELETE_TASKS_MUTATION = gql`
  mutation BulkDeleteTasks($ids: [ID!]!) {
    bulkDeleteTasks(ids: $ids) {
      id
      order_id
      order {
        id
        qr_code
      }
      user_id
      user {
        id
        name
        email
      }
      vehicle_id
      vehicle {
        id
        plate_number
      }
      from_branch_id
      fromBranch {
        id
        name
      }
      to_branch_id
      toBranch {
        id
        name
      }
      from_customer_id
      fromCustomer {
        id
        market_name
      }
      to_customer_id
      toCustomer {
        id
        market_name
      }
      task_type_id
      taskType {
        id
        task_en
        task_ar
      }
      current_status
      previous_status
      completed_at
      reason_for_cancellation
      is_auto_created
      created_by
      createdBy {
        id
        name
        email
      }
      created_at
      updated_at
    }
  }
`


