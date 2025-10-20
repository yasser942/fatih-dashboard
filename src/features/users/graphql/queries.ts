import { gql } from '@apollo/client'

export const USERS_QUERY = gql`
  query Users {
    users {
      id
      name
      email
      roles {
        id
        name
        guard_name
      }
      created_at
      updated_at
    }
  }
`

export const ROLES_QUERY = gql`
  query Roles {
    roles {
      id
      name
      guard_name
    }
  }
`

