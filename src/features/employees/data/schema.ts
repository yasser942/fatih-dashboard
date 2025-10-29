import { z } from 'zod'

export const employeeContractTypeValues = ['full_time', 'part_time', 'intern', 'contract'] as const
export type EmployeeContractType = (typeof employeeContractTypeValues)[number]

export const employeeStatusValues = ['active', 'inactive', 'on_leave', 'terminated'] as const
export type EmployeeStatus = (typeof employeeStatusValues)[number]

export type Employee = {
    id: number
    branch_id: number
    branch?: {
        id: number
        name: string
    }
    user_id: number
    user?: {
        id: number
        name: string
        email: string
    }
    department_id: number
    department?: {
        id: number
        name: string
    }
    position_id: number
    position?: {
        id: number
        title: string
    }
    hired_date: string
    salary: number
    contract_type: EmployeeContractType
    status: EmployeeStatus
    supervisor_id?: number | null
    supervisor?: {
        id: number
        user?: {
            id: number
            name: string
            email: string
        }
    }
    created_at?: string
    updated_at?: string
}

export const createEmployeeSchema = z.object({
    branch_id: z.coerce.number().min(1, 'يجب اختيار الفرع'),
    user_id: z.coerce.number().min(1, 'يجب اختيار المستخدم'),
    department_id: z.coerce.number().min(1, 'يجب اختيار القسم'),
    position_id: z.coerce.number().min(1, 'يجب اختيار الوظيفة'),
    hired_date: z.string().min(1, 'يجب إدخال تاريخ التوظيف'),
    salary: z.coerce.number().min(0, 'الراتب يجب أن يكون أكبر من أو يساوي 0'),
    contract_type: z.enum(employeeContractTypeValues),
    status: z.enum(employeeStatusValues),
    supervisor_id: z.coerce.number().optional(),
})

export const updateEmployeeSchema = createEmployeeSchema.partial().passthrough()

export type CreateEmployee = z.infer<typeof createEmployeeSchema>
export type UpdateEmployee = z.infer<typeof updateEmployeeSchema>

export type PaginatorInfo = {
    count: number
    currentPage: number
    firstItem?: number
    hasMorePages: boolean
    lastItem?: number
    perPage: number
    total: number
}

export type EmployeesPaginatedResponse = {
    data: Employee[]
    paginatorInfo: PaginatorInfo
}

// New schemas for inline user creation (no user dropdown)
export const createEmployeeWithUserSchema = z.object({
    branch_id: z.coerce.number().min(1, 'يجب اختيار الفرع'),
    department_id: z.coerce.number().min(1, 'يجب اختيار القسم'),
    position_id: z.coerce.number().min(1, 'يجب اختيار الوظيفة'),
    hired_date: z.string().min(1, 'يجب إدخال تاريخ التوظيف'),
    salary: z.coerce.number().min(0, 'الراتب يجب أن يكون أكبر من أو يساوي 0'),
    contract_type: z.enum(employeeContractTypeValues),
    status: z.enum(employeeStatusValues),
    supervisor_id: z.coerce.number().optional(),
    // User fields
    user_name: z.string().min(1, 'الاسم مطلوب'),
    user_email: z.string().email('البريد الإلكتروني غير صحيح'),
    user_password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
    user_status: z.enum(['Active', 'Inactive', 'Pending', 'Blocked'] as const),
})

export const updateEmployeeWithUserSchema = createEmployeeWithUserSchema.partial().extend({
    // For update, still require core employee fields
    branch_id: z.coerce.number().min(1, 'يجب اختيار الفرع').optional(),
    department_id: z.coerce.number().min(1, 'يجب اختيار القسم').optional(),
    position_id: z.coerce.number().min(1, 'يجب اختيار الوظيفة').optional(),
    hired_date: z.string().min(1, 'يجب إدخال تاريخ التوظيف').optional(),
    salary: z.coerce.number().min(0, 'الراتب يجب أن يكون أكبر من أو يساوي 0').optional(),
    contract_type: z.enum(employeeContractTypeValues).optional(),
    status: z.enum(employeeStatusValues).optional(),
    supervisor_id: z.coerce.number().optional(),
    // Make password optional when updating
    user_password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل').optional(),
})

export type CreateEmployeeWithUser = z.infer<typeof createEmployeeWithUserSchema>
export type UpdateEmployeeWithUser = z.infer<typeof updateEmployeeWithUserSchema>