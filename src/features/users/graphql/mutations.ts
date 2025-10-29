import { gql } from '@apollo/client/core'

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      full_name
      email
      birth_date
      mother_name
      system_user_name
      iban
      phone
      Job
      location_id
      location {
        id
        country_en
        country_ar
      }
      full_address
      latitude
      longitude
      status
      is_account
      roles {
        id
        name
      }
      permissions {
        id
        name
      }
      created_at
      updated_at
    }
  }
`

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      full_name
      email
      birth_date
      mother_name
      system_user_name
      iban
      phone
      Job
      location_id
      location {
        id
        country_en
        country_ar
      }
      full_address
      latitude
      longitude
      status
      is_account
      roles {
        id
        name
      }
      permissions {
        id
        name
      }
      updated_at
    }
  }
`

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`

export const BULK_DELETE_USERS_MUTATION = gql`
  mutation BulkDeleteUsers($ids: [ID!]!) {
    bulkDeleteUsers(ids: $ids) {
      id
      name
      email
      status
      created_at
      updated_at
    }
  }
`

export const ASSIGN_ROLES_MUTATION = gql`
  mutation AssignRolesToUser($id: ID!, $input: AssignRolesInput!) {
    assignRolesToUser(id: $id, input: $input) {
      id
      roles {
        id
        name
      }
    }
  }
`

export const ASSIGN_PERMISSIONS_MUTATION = gql`
  mutation AssignPermissionsToUser($id: ID!, $input: AssignPermissionsInput!) {
    assignPermissionsToUser(id: $id, input: $input) {
      id
      permissions {
        id
        name
      }
    }
  }
`

export const CREATE_USER_WITH_PROFILE = gql`
  mutation CreateUserWithProfile($input: CreateUserWithProfileInput!) {
    createUserWithProfile(input: $input) {
      id
      name
      email
      customer { id customer_type status }
      employee { id contract_type status }
    }
  }
`

export const UPDATE_USER_WITH_PROFILE = gql`
  mutation UpdateUserWithProfile($id: ID!, $input: UpdateUserWithProfileInput!) {
    updateUserWithProfile(id: $id, input: $input) {
      id
      name
      email
      customer { id customer_type status }
      employee { id contract_type status }
    }
  }
`
