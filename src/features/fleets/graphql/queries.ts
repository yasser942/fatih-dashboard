import { gql } from '@apollo/client/core'

export const FLEETS_QUERY = gql`
  query Fleets {
    fleets {
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
