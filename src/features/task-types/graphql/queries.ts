import { gql } from '@apollo/client/core'

export const TASK_TYPES_QUERY = gql`
  query TaskTypes($first: Int, $page: Int, $orderBy: [OrderByClause!], $search: String) {
    taskTypes(first: $first, page: $page, orderBy: $orderBy, search: $search) {
      data {
        id
        task_en
        task_ar
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

export const TASK_TYPE_QUERY = gql`
  query TaskType($id: ID!) {
    taskType(id: $id) {
      id
      task_en
      task_ar
      status
      created_at
      updated_at
    }
  }
`

