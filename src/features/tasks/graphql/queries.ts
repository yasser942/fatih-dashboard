import { gql } from '@apollo/client/core'

export const GET_TASKS_QUERY = gql`
  query Tasks($first: Int, $page: Int, $orderBy: [OrderByClause!], $search: String) {
    tasks(first: $first, page: $page, orderBy: $orderBy, search: $search) {
      data {
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

export const GET_TASK_QUERY = gql`
  query Task($id: ID!) {
    task(id: $id) {
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


