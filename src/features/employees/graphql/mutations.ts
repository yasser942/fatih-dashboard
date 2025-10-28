import { gql } from '@apollo/client/core'

export const CREATE_EMPLOYEE_MUTATION = gql`
  mutation CreateEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      id
      branch_id
      user_id
      department_id
      position_id
      hired_date
      salary
      contract_type
      status
      supervisor_id
      created_at
      updated_at
    }
  }
`

export const UPDATE_EMPLOYEE_MUTATION = gql`
  mutation UpdateEmployee($id: ID!, $input: UpdateEmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      id
      branch_id
      user_id
      department_id
      position_id
      hired_date
      salary
      contract_type
      status
      supervisor_id
      updated_at
    }
  }
`

export const DELETE_EMPLOYEE_MUTATION = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
      id
    }
  }
`

export const BULK_DELETE_EMPLOYEES_MUTATION = gql`
  mutation BulkDeleteEmployees($ids: [ID!]!) {
    bulkDeleteEmployees(ids: $ids) {
      id
      user {
        id
        name
        email
      }
    }
  }
`




