import { gql } from '@apollo/client/core'

export const CREATE_FLEET_MUTATION = gql`
  mutation CreateFleet($input: CreateFleetInput!) {
    createFleet(input: $input) {
      id
      fleet_type_id
      fleetType {
        id
        type_en
        type_ar
        capacity
        status
      }
      user_id
      user {
        id
        name
        email
      }
      plate_number
      status
      created_at
      updated_at
    }
  }
`

export const UPDATE_FLEET_MUTATION = gql`
  mutation UpdateFleet($id: ID!, $input: UpdateFleetInput!) {
    updateFleet(id: $id, input: $input) {
      id
      fleet_type_id
      fleetType {
        id
        type_en
        type_ar
        capacity
        status
      }
      user_id
      user {
        id
        name
        email
      }
      plate_number
      status
      updated_at
    }
  }
`

export const DELETE_FLEET_MUTATION = gql`
  mutation DeleteFleet($id: ID!) {
    deleteFleet(id: $id) {
      id
    }
  }
`
