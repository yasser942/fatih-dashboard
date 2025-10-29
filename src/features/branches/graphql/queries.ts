import { gql } from '@apollo/client/core'

export const BRANCHES_QUERY = gql`
  query Branches {
    branches {
      id
      name
      status
      location_id
      location { id Location_Pcode country_ar }
      full_address
      latitude
      longitude
      created_at
      updated_at
    }
  }
`

export const BRANCHES_PAGINATED_QUERY = gql`
  query BranchesPaginated($first: Int, $page: Int, $orderBy: [OrderByClause!], $search: String, $status: BranchStatus, $location_id: ID) {
    branchesPaginated(first: $first, page: $page, orderBy: $orderBy, search: $search, status: $status, location_id: $location_id) {
      data {
        id
        name
        status
        location_id
        location { id Location_Pcode country_ar }
        full_address
        latitude
        longitude
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


