import { gql } from '@apollo/client/core'

export const DEPARTMENTS_QUERY = gql`
  query Departments($first: Int, $page: Int, $orderBy: [OrderByClause!], $search: String) {
    departments(first: $first, page: $page, orderBy: $orderBy, search: $search) {
      data {
        id
        name
        description
        manager_id
        manager {
          id
          user {
            id
            name
            email
          }
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

export const DEPARTMENT_QUERY = gql`
  query Department($id: ID!) {
    department(id: $id) {
      id
      name
      description
      manager_id
      manager {
        id
        user {
          id
          name
          email
        }
      }
      created_at
      updated_at
    }
  }
`




