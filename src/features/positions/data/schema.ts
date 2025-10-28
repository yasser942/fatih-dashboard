import { z } from 'zod'

export type Position = {
    id: number
    title: string
    description?: string | null
    department_id: number
    department?: {
        id: number
        name: string
    }
    created_at?: string
    updated_at?: string
}

export const createPositionSchema = z.object({
    title: z.string().min(1, 'يجب إدخال عنوان الوظيفة'),
    description: z.string().optional(),
    department_id: z.coerce.number().min(1, 'يجب اختيار القسم'),
})

export const updatePositionSchema = createPositionSchema.partial().passthrough()

export type CreatePosition = z.infer<typeof createPositionSchema>
export type UpdatePosition = z.infer<typeof updatePositionSchema>

export type PaginatorInfo = {
    count: number
    currentPage: number
    firstItem?: number
    hasMorePages: boolean
    lastItem?: number
    perPage: number
    total: number
}

export type PositionsPaginatedResponse = {
    data: Position[]
    paginatorInfo: PaginatorInfo
}




