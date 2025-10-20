import { z } from 'zod'

export const branchStatusValues = ['Active', 'Inactive'] as const
export type BranchStatus = typeof branchStatusValues[number]

export type Branch = {
    id: number
    name: string
    status: BranchStatus
    location_id: number
    full_address?: string | null
    latitude?: number | null
    longitude?: number | null
    created_at?: string
    updated_at?: string
}

export const createBranchSchema = z.object({
    name: z.string().min(1, 'الاسم مطلوب'),
    status: z.enum(branchStatusValues),
    location_id: z.coerce.number(),
    full_address: z.string().optional(),
    latitude: z.coerce.number().optional().nullable(),
    longitude: z.coerce.number().optional().nullable(),
})

export const updateBranchSchema = createBranchSchema.partial().passthrough()

export type CreateBranch = z.infer<typeof createBranchSchema>
export type UpdateBranch = z.infer<typeof updateBranchSchema>


