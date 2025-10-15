export interface User {
  id: string
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
  roles: Role[]
  permissions: Permission[]
}

export interface Role {
  id: string
  name: string
  guard_name: string
  created_at: string
  updated_at: string
}

export interface Permission {
  id: string
  name: string
  guard_name: string
  created_at: string
  updated_at: string
}

export interface AuthPayload {
  user: User
  access_token: string
  token_type: string
}

export interface LogoutPayload {
  message: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  password_confirmation: string
}
