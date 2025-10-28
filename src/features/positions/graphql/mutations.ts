import { gql } from '@apollo/client/core'

export const CREATE_POSITION_MUTATION = gql`
  mutation CreatePosition($input: CreatePositionInput!) {
    createPosition(input: $input) {
      id
      title
      description
      department_id
      created_at
      updated_at
    }
  }
`

export const UPDATE_POSITION_MUTATION = gql`
  mutation UpdatePosition($id: ID!, $input: UpdatePositionInput!) {
    updatePosition(id: $id, input: $input) {
      id
      title
      description
      department_id
      updated_at
    }
  }
`

export const DELETE_POSITION_MUTATION = gql`
  mutation DeletePosition($id: ID!) {
    deletePosition(id: $id) {
      id
    }
  }
`

export const BULK_DELETE_POSITIONS_MUTATION = gql`
  mutation BulkDeletePositions($ids: [ID!]!) {
    bulkDeletePositions(ids: $ids) {
      id
      title
      description
      department_id
      created_at
      updated_at
    }
  }
`




