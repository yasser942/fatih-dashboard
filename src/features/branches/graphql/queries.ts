import { gql } from '@apollo/client/core'

export const BRANCHES_QUERY = gql`
  query Branches {
    branches {
      id
      name
      status
      location_id
      location { id Location_Pcode country_ar }
      full_address
      latitude
      longitude
      created_at
      updated_at
    }
  }
`


