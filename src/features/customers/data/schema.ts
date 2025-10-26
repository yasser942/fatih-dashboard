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
