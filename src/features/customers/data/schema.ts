import { z } from 'zod'

export const customerStatusValues = ['Active', 'Inactive'] as const
export type CustomerStatus = typeof customerStatusValues[number]

export const customerTypeValues = ['Individual', 'Company'] as const
export type CustomerType = typeof customerTypeValues[number]

export type Customer = {
    id: number
    customer_type: CustomerType
    market_name?: string | null
    user_id: number
    user?: {
        id: number
        name: string
        email: string
    }
    status: CustomerStatus
    created_at?: string
    updated_at?: string
}

export const createCustomerSchema = z.object({
    customer_type: z.enum(customerTypeValues),
    market_name: z.string().optional(),
    user_id: z.number().min(1, 'يجب اختيار مستخدم'),
    status: z.enum(customerStatusValues),
})

export const updateCustomerSchema = createCustomerSchema.partial().passthrough()

export type CreateCustomer = z.infer<typeof createCustomerSchema>
export type UpdateCustomer = z.infer<typeof updateCustomerSchema>

export type PaginatorInfo = {
    count: number
    currentPage: number
    firstItem?: number
    hasMorePages: boolean
    lastItem?: number
    perPage: number
    total: number
}

export type CustomersPaginatedResponse = {
    data: Customer[]
    paginatorInfo: PaginatorInfo
}

// Extended schema to allow creating a new user inline instead of selecting existing user
export const createCustomerWithUserSchema = z.object({
    customer_type: z.enum(customerTypeValues),
    market_name: z.string().optional(),
    status: z.enum(customerStatusValues),
    user_name: z.string().min(1, 'الاسم مطلوب'),
    user_email: z.string().email('البريد الإلكتروني غير صحيح'),
    user_password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
    user_status: z.enum(['Active', 'Inactive', 'Pending', 'Blocked'] as const),
})

export type CreateCustomerWithUser = z.infer<typeof createCustomerWithUserSchema>
