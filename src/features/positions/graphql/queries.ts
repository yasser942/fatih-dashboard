import { gql } from '@apollo/client/core'

export const POSITIONS_QUERY = gql`
  query Positions($first: Int, $page: Int, $orderBy: [OrderByClause!], $search: String) {
    positions(first: $first, page: $page, orderBy: $orderBy, search: $search) {
      data {
        id
        title
        description
        department_id
        department {
          id
          name
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

export const POSITION_QUERY = gql`
  query Position($id: ID!) {
    position(id: $id) {
      id
      title
      description
      department_id
      department {
        id
        name
      }
      created_at
      updated_at
    }
  }
`




