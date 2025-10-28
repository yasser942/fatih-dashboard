import { gql } from '@apollo/client/core'

export const EMPLOYEES_QUERY = gql`
  query Employees($first: Int, $page: Int, $orderBy: [OrderByClause!], $search: String) {
    employees(first: $first, page: $page, orderBy: $orderBy, search: $search) {
      data {
        id
        branch_id
        branch {
          id
          name
        }
        user_id
        user {
          id
          name
          email
        }
        department_id
        department {
          id
          name
        }
        position_id
        position {
          id
          title
        }
        hired_date
        salary
        contract_type
        status
        supervisor_id
        supervisor {
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

export const EMPLOYEE_QUERY = gql`
  query Employee($id: ID!) {
    employee(id: $id) {
      id
      branch_id
      branch {
        id
        name
      }
      user_id
      user {
        id
        name
        email
      }
      department_id
      department {
        id
        name
      }
      position_id
      position {
        id
        title
      }
      hired_date
      salary
      contract_type
      status
      supervisor_id
      supervisor {
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




