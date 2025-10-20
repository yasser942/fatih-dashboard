import { gql } from '@apollo/client/core'

export const CREATE_BRANCH_MUTATION = gql`
  mutation CreateBranch($input: CreateBranchInput!) {
    createBranch(input: $input) {
      id
      name
      status
      location_id
      full_address
      latitude
      longitude
      created_at
      updated_at
    }
  }
`

export const UPDATE_BRANCH_MUTATION = gql`
  mutation UpdateBranch($id: ID!, $input: UpdateBranchInput!) {
    updateBranch(id: $id, input: $input) {
      id
      name
      status
      location_id
      full_address
      latitude
      longitude
      updated_at
    }
  }
`

export const DELETE_BRANCH_MUTATION = gql`
  mutation DeleteBranch($id: ID!) {
    deleteBranch(id: $id) {
      id
    }
  }
`


