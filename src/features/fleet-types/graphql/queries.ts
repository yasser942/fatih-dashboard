import { gql } from '@apollo/client'

export const GET_FLEET_TYPES = gql`
  query GetFleetTypes {
    fleetTypes {
      id
      type_en
      type_ar
      capacity
      status
      created_at
      updated_at
    }
  }
`
