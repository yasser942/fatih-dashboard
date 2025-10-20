import { gql } from '@apollo/client'

export const CREATE_LOCATION_MASTER_MUTATION = gql`
  mutation CreateLocationMaster($input: CreateLocationMasterInput!) {
    createLocationMaster(input: $input) {
      id
      country_en
      country_ar
      country0Pcode
      governorate_en
      governorate_ar
      governorate1Pcode
      district_en
      district_ar
      districtPcode
      subdistrict_en
      subdistrict_ar
      subdistrictPcode
      village_town_en
      village_town_ar
      village_townPcode
      neighborhood_community_en
      neighborhood_community_ar
      Location_Pcode
      location_type
      Latitude_y
      Longitude_x
      is_active
      created_at
      updated_at
    }
  }
`

export const UPDATE_LOCATION_MASTER_MUTATION = gql`
  mutation UpdateLocationMaster($id: ID!, $input: UpdateLocationMasterInput!) {
    updateLocationMaster(id: $id, input: $input) {
      id
      country_en
      country_ar
      country0Pcode
      governorate_en
      governorate_ar
      governorate1Pcode
      district_en
      district_ar
      districtPcode
      subdistrict_en
      subdistrict_ar
      subdistrictPcode
      village_town_en
      village_town_ar
      village_townPcode
      neighborhood_community_en
      neighborhood_community_ar
      Location_Pcode
      location_type
      Latitude_y
      Longitude_x
      is_active
      created_at
      updated_at
    }
  }
`

export const DELETE_LOCATION_MASTER_MUTATION = gql`
  mutation DeleteLocationMaster($id: ID!) {
    deleteLocationMaster(id: $id) {
      id
      Location_Pcode
    }
  }
`

