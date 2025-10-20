import { gql } from '@apollo/client'

export const PERMISSIONS_QUERY = gql`
  query Permissions {
    permissions {
      id
      name
      guard_name
      roles {
        id
        name
      }
      users {
        id
        name
      }
      users_count
      roles_count
      created_at
      updated_at
    }
  }
`

