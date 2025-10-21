import { gql } from '@apollo/client'

export const CREATE_FLEET_TYPE = gql`
  mutation CreateFleetType($type_en: String!, $type_ar: String!, $capacity: Float!, $status: FleetTypeStatus!) {
    createFleetType(type_en: $type_en, type_ar: $type_ar, capacity: $capacity, status: $status) {
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

export const UPDATE_FLEET_TYPE = gql`
  mutation UpdateFleetType($id: ID!, $type_en: String, $type_ar: String, $capacity: Float, $status: FleetTypeStatus) {
    updateFleetType(id: $id, type_en: $type_en, type_ar: $type_ar, capacity: $capacity, status: $status) {
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

export const DELETE_FLEET_TYPE = gql`
  mutation DeleteFleetType($id: ID!) {
    deleteFleetType(id: $id) {
      id
      type_en
      type_ar
      capacity
      status
    }
  }
`
