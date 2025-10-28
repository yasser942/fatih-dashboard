import { gql } from '@apollo/client/core'

export const CREATE_DEPARTMENT_MUTATION = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      id
      name
      description
      manager_id
      created_at
      updated_at
    }
  }
`

export const UPDATE_DEPARTMENT_MUTATION = gql`
  mutation UpdateDepartment($id: ID!, $input: UpdateDepartmentInput!) {
    updateDepartment(id: $id, input: $input) {
      id
      name
      description
      manager_id
      updated_at
    }
  }
`

export const DELETE_DEPARTMENT_MUTATION = gql`
  mutation DeleteDepartment($id: ID!) {
    deleteDepartment(id: $id) {
      id
    }
  }
`

export const BULK_DELETE_DEPARTMENTS_MUTATION = gql`
  mutation BulkDeleteDepartments($ids: [ID!]!) {
    bulkDeleteDepartments(ids: $ids) {
      id
      name
      description
      manager_id
      created_at
      updated_at
    }
  }
`




