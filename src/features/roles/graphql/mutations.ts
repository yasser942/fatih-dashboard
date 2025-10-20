import { gql } from '@apollo/client'

export const CREATE_ROLE_MUTATION = gql`
  mutation CreateRole($name: String!, $guard_name: String!, $permissions: [String!]) {
    createRole(name: $name, guard_name: $guard_name, permissions: $permissions) {
      id
      name
      guard_name
      permissions {
        id
        name
        guard_name
      }
      users_count
      created_at
      updated_at
    }
  }
`

export const UPDATE_ROLE_MUTATION = gql`
  mutation UpdateRole($id: ID!, $name: String, $guard_name: String) {
    updateRole(id: $id, name: $name, guard_name: $guard_name) {
      id
      name
      guard_name
      permissions {
        id
        name
        guard_name
      }
      users_count
      created_at
      updated_at
    }
  }
`

export const DELETE_ROLE_MUTATION = gql`
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id)
  }
`

export const GIVE_ROLE_PERMISSION_MUTATION = gql`
  mutation GiveRolePermission($role: String!, $permission: String!) {
    giveRolePermission(role: $role, permission: $permission) {
      id
      name
      guard_name
      permissions {
        id
        name
        guard_name
      }
    }
  }
`

export const REVOKE_ROLE_PERMISSION_MUTATION = gql`
  mutation RevokeRolePermission($role: String!, $permission: String!) {
    revokeRolePermission(role: $role, permission: $permission) {
      id
      name
      guard_name
      permissions {
        id
        name
        guard_name
      }
    }
  }
`

