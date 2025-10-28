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




