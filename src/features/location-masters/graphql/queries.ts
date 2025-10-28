import { gql } from '@apollo/client'

export const LOCATION_MASTERS_QUERY = gql`
  query LocationMasters {
    locationMasters {
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
    }
  }
`

export const LOCATION_MASTER_QUERY = gql`
  query LocationMaster($id: ID!) {
    locationMaster(id: $id) {
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
    }
  }
`


