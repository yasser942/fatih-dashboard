import { gql } from '@apollo/client'
import type {
  AuthPayload,
  LogoutPayload,
  LoginInput,
  RegisterInput,
} from '../types'

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        name
        email
        email_verified_at
        created_at
        updated_at
        roles {
          id
          name
          guard_name
          created_at
          updated_at
        }
        permissions {
          id
          name
          guard_name
          created_at
          updated_at
        }
      }
      access_token
      token_type
    }
  }
`

export const REGISTER_MUTATION = gql`
  mutation Register(
    $name: String!
    $email: String!
    $password: String!
    $password_confirmation: String!
  ) {
    register(
      name: $name
      email: $email
      password: $password
      password_confirmation: $password_confirmation
    ) {
      user {
        id
        name
        email
        email_verified_at
        created_at
        updated_at
        roles {
          id
          name
          guard_name
          created_at
          updated_at
        }
        permissions {
          id
          name
          guard_name
          created_at
          updated_at
        }
      }
      access_token
      token_type
    }
  }
`

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      message
    }
  }
`

// TypeScript types for mutations
export interface LoginMutationData {
  login: AuthPayload
}

export interface LoginMutationVariables {
  input: LoginInput
}

export interface RegisterMutationData {
  register: AuthPayload
}

export interface RegisterMutationVariables {
  input: RegisterInput
}

export interface LogoutMutationData {
  logout: LogoutPayload
}
