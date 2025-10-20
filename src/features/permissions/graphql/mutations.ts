import { gql } from '@apollo/client'

export const CREATE_PERMISSION_MUTATION = gql`
  mutation CreatePermission($name: String!, $guard_name: String!) {
    createPermission(name: $name, guard_name: $guard_name) {
      id
      name
      guard_name
      roles {
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

export const UPDATE_PERMISSION_MUTATION = gql`
  mutation UpdatePermission($id: ID!, $name: String, $guard_name: String) {
    updatePermission(id: $id, name: $name, guard_name: $guard_name) {
      id
      name
      guard_name
      roles {
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

export const DELETE_PERMISSION_MUTATION = gql`
  mutation DeletePermission($id: ID!) {
    deletePermission(id: $id)
  }
`

