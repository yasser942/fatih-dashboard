import { gql } from '@apollo/client'

export const ASSIGN_ROLE_MUTATION = gql`
  mutation AssignRole($user_id: ID!, $role: String!) {
    assignRole(user_id: $user_id, role: $role) {
      id
      name
      email
      roles {
        id
        name
        guard_name
      }
    }
  }
`

export const REVOKE_ROLE_MUTATION = gql`
  mutation RevokeRole($user_id: ID!, $role: String!) {
    revokeRole(user_id: $user_id, role: $role) {
      id
      name
      email
      roles {
        id
        name
        guard_name
      }
    }
  }
`

export const SYNC_ROLES_MUTATION = gql`
  mutation SyncRoles($user_id: ID!, $roles: [String!]!) {
    syncRoles(user_id: $user_id, roles: $roles) {
      id
      name
      email
      roles {
        id
        name
        guard_name
      }
    }
  }
`

