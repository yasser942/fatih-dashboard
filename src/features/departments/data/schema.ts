import { z } from 'zod'

export type Department = {
    id: number
    name: string
    description?: string | null
    manager_id?: number | null
    manager?: {
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

export const createDepartmentSchema = z.object({
    name: z.string().min(1, 'يجب إدخال اسم القسم'),
    description: z.string().optional(),
    manager_id: z.coerce.number().optional(),
})

export const updateDepartmentSchema = createDepartmentSchema.partial().passthrough()

export type CreateDepartment = z.infer<typeof createDepartmentSchema>
export type UpdateDepartment = z.infer<typeof updateDepartmentSchema>

export type PaginatorInfo = {
    count: number
    currentPage: number
    firstItem?: number
    hasMorePages: boolean
    lastItem?: number
    perPage: number
    total: number
}

export type DepartmentsPaginatedResponse = {
    data: Department[]
    paginatorInfo: PaginatorInfo
}




