import { gql } from '@apollo/client/core'

export const USERS_QUERY = gql`
  query Users($first: Int, $page: Int, $orderBy: [OrderByClause!], $search: String) {
    users(first: $first, page: $page, orderBy: $orderBy, search: $search) {
      data {
        id
        name
        full_name
        email
        birth_date
        mother_name
        system_user_name
        iban
        phone
        Job
        location_id
        location {
          id
          country_en
          country_ar
          governorate_en
          governorate_ar
          district_en
          district_ar
        }
        full_address
        latitude
        longitude
        status
        is_account
        roles {
          id
          name
        }
        permissions {
          id
          name
        }
        customer {
          id
          customer_type
          market_name
          status
        }
        employee {
          id
          branch { id name }
          department { id name }
          position { id title }
          hired_date
          salary
          contract_type
          status
          supervisor { id }
        }
        created_at
        updated_at
        orders_count
      }
      paginatorInfo {
        count
        currentPage
        firstItem
        hasMorePages
        lastItem
        perPage
        total
      }
    }
  }
`

export const USER_QUERY = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      name
      full_name
      email
      birth_date
      mother_name
      system_user_name
      iban
      phone
      Job
      location_id
      location {
        id
        country_en
        country_ar
        governorate_en
        governorate_ar
        district_en
        district_ar
      }
      full_address
      latitude
      longitude
      status
      is_account
      roles {
        id
        name
      }
      permissions {
        id
        name
      }
      customer {
        id
        customer_type
        market_name
        status
      }
      employee {
        id
        branch { id name }
        department { id name }
        position { id title }
        hired_date
        salary
        contract_type
        status
        supervisor { id }
      }
      created_at
      updated_at
      orders_count
    }
  }
`
