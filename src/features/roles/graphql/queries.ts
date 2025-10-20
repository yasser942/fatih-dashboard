import { gql } from '@apollo/client'

export const ROLES_QUERY = gql`
  query Roles {
    roles {
      id
      name
      guard_name
      permissions {
        id
        name
        guard_name
      }
      users {
        id
        name
        email
      }
      users_count
      created_at
      updated_at
    }
  }
`

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

