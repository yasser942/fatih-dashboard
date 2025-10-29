import { z } from 'zod'
import { customerStatusValues, customerTypeValues } from '@/features/customers/data/schema'
import { employeeContractTypeValues, employeeStatusValues } from '@/features/employees/data/schema'

export const userStatusValues = ['Active', 'Inactive', 'Pending', 'Blocked'] as const
export type UserStatus = (typeof userStatusValues)[number]

export type User = {
  id: number
  name: string
  full_name?: string | null
  email: string
  birth_date?: string | null
  mother_name?: string | null
  system_user_name?: string | null
  iban?: string | null
  phone?: string | null
  Job?: string | null
  location_id?: number | null
  location?: {
    id: number
    country_en: string
    country_ar: string
    governorate_en: string
    governorate_ar: string
    district_en: string
    district_ar: string
  } | null
  full_address?: string | null
  latitude?: number | null
  longitude?: number | null
  status: UserStatus
  is_account: boolean
  roles?: Array<{
    id: number
    name: string
  }>
  permissions?: Array<{
    id: number
    name: string
  }>
  created_at?: string
  updated_at?: string
  customer?: {
    id: number
    customer_type: (typeof customerTypeValues)[number]
    market_name?: string | null
    status: (typeof customerStatusValues)[number]
  } | null
  employee?: {
    id: number
    branch?: { id: number; name: string } | null
    department?: { id: number; name: string } | null
    position?: { id: number; title: string } | null
    hired_date: string
    salary: number
    contract_type: (typeof employeeContractTypeValues)[number]
    status: (typeof employeeStatusValues)[number]
    supervisor?: { id: number } | null
  } | null
}

export const createUserSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب'),
  full_name: z.string().optional(),
  email: z.string().email('البريد الإلكتروني غير صحيح').min(1, 'البريد الإلكتروني مطلوب'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  birth_date: z.string().optional(),
  mother_name: z.string().optional(),
  system_user_name: z.string().optional(),
  iban: z.string().optional(),
  phone: z.string().optional(),
  Job: z.string().optional(),
  location_id: z.number().optional(),
  full_address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  status: z.enum(userStatusValues),
  is_account: z.boolean().optional(),
})

export const updateUserSchema = z
  .object({
    name: z.string().min(1, 'الاسم مطلوب').optional(),
    full_name: z.string().optional(),
    email: z.string().email('البريد الإلكتروني غير صحيح').optional(),
    password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل').optional(),
    birth_date: z.string().optional(),
    mother_name: z.string().optional(),
    system_user_name: z.string().optional(),
    iban: z.string().optional(),
    phone: z.string().optional(),
    Job: z.string().optional(),
    location_id: z.number().optional(),
    full_address: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    status: z.enum(userStatusValues).optional(),
    is_account: z.boolean().optional(),
  })
  .partial()
  .passthrough()

export type CreateUser = z.infer<typeof createUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>

export type PaginatorInfo = {
  count: number
  currentPage: number
  firstItem?: number
  hasMorePages: boolean
  lastItem?: number
  perPage: number
  total: number
}

export type UsersPaginatedResponse = {
  data: User[]
  paginatorInfo: PaginatorInfo
}

// Unified user kind
export const userKindValues = ['User', 'Customer', 'Employee'] as const
export const createUserKindValues = ['Customer', 'Employee'] as const
export type UserKind = (typeof userKindValues)[number]

// Unified create/update schemas
const customerProfileCreateSchema = z.object({
  customer_type: z.enum(customerTypeValues),
  market_name: z.string().optional().nullable(),
  status: z.enum(customerStatusValues),
})

const customerProfileUpdateSchema = customerProfileCreateSchema.partial()

const employeeProfileCreateSchema = z.object({
  branch_id: z.number(),
  department_id: z.number(),
  position_id: z.number(),
  hired_date: z.string(),
  salary: z.number().nonnegative(),
  contract_type: z.enum(employeeContractTypeValues),
  status: z.enum(employeeStatusValues),
  supervisor_id: z.number().optional().nullable(),
})

const employeeProfileUpdateSchema = employeeProfileCreateSchema.partial()

export const createUserWithProfileSchema = z
  .object({
    kind: z.enum(createUserKindValues),
    user: createUserSchema,
    customer: customerProfileCreateSchema.optional(),
    employee: employeeProfileCreateSchema.optional(),
  })
  .superRefine((val, ctx) => {
    if (val.kind === 'Customer' && !val.customer) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['customer'], message: 'بيانات العميل مطلوبة' })
    }
    if (val.kind === 'Employee' && !val.employee) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['employee'], message: 'بيانات الموظف مطلوبة' })
    }
    if (val.kind === 'User') {
      if (val.customer) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['customer'], message: 'غير متوقع' })
      if (val.employee) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['employee'], message: 'غير متوقع' })
    }
  })

export const updateUserWithProfileSchema = z.object({
  kind: z.enum(userKindValues),
  user: updateUserSchema.optional(),
  customer: customerProfileUpdateSchema.optional(),
  employee: employeeProfileUpdateSchema.optional(),
})

export type CreateUserWithProfile = z.infer<typeof createUserWithProfileSchema>
export type UpdateUserWithProfile = z.infer<typeof updateUserWithProfileSchema>

// Flat schema for form validation (matches the form structure)
export const createUserWithProfileFlatSchema = z.object({
  // User fields
  name: z.string().min(1, 'الاسم مطلوب'),
  full_name: z.string().optional(),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل').optional(),
  birth_date: z.string().optional(),
  mother_name: z.string().optional(),
  system_user_name: z.string().optional(),
  iban: z.string().optional(),
  phone: z.string().optional(),
  Job: z.string().optional(),
  location_id: z.number().optional(),
  full_address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  status: z.enum(userStatusValues),
  is_account: z.boolean(),

  // Kind selector (create only Customer/Employee)
  kind: z.enum(createUserKindValues),

  // Customer fields
  customer_type: z.enum(customerTypeValues).optional(),
  customer_market_name: z.string().optional(),
  customer_status: z.enum(customerStatusValues).optional(),

  // Employee fields
  branch_id: z.number().optional(),
  department_id: z.number().optional(),
  position_id: z.number().optional(),
  hired_date: z.string().optional(),
  salary: z.number().optional(),
  contract_type: z.enum(employeeContractTypeValues).optional(),
  employee_status: z.enum(employeeStatusValues).optional(),
  supervisor_id: z.number().optional(),
}).superRefine((data, ctx) => {
  if (data.kind === 'Customer') {
    if (!data.customer_type) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['customer_type'], message: 'نوع العميل مطلوب' })
    }
    if (!data.customer_status) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['customer_status'], message: 'حالة العميل مطلوبة' })
    }
  }
  if (data.kind === 'Employee') {
    if (!data.branch_id) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['branch_id'], message: 'الفرع مطلوب' })
    }
    if (!data.department_id) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['department_id'], message: 'القسم مطلوب' })
    }
    if (!data.position_id) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['position_id'], message: 'الوظيفة مطلوبة' })
    }
    if (!data.hired_date) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['hired_date'], message: 'تاريخ التوظيف مطلوب' })
    }
    if (data.salary === undefined || data.salary === null || Number.isNaN(data.salary)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['salary'], message: 'الراتب مطلوب' })
    }
    if (!data.contract_type) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['contract_type'], message: 'نوع العقد مطلوب' })
    }
    if (!data.employee_status) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['employee_status'], message: 'حالة الموظف مطلوبة' })
    }
  }
})

export const updateUserWithProfileFlatSchema = createUserWithProfileFlatSchema.partial()

export type CreateUserWithProfileFlat = z.infer<typeof createUserWithProfileFlatSchema>
export type UpdateUserWithProfileFlat = z.infer<typeof updateUserWithProfileFlatSchema>
