import { z } from 'zod'

export const roleSchema = z.object({
    id: z.string(),
    name: z.string(),
    guard_name: z.string(),
    permissions: z.array(z.object({
        id: z.string(),
        name: z.string(),
        guard_name: z.string(),
    })).optional().default([]),
    users: z.array(z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
    })).optional().default([]),
    users_count: z.number().optional().default(0),
    created_at: z.string(),
    updated_at: z.string(),
})

export const permissionSchema = z.object({
    id: z.string(),
    name: z.string(),
    guard_name: z.string(),
    roles: z.array(z.object({
        id: z.string(),
        name: z.string(),
    })).optional().default([]),
    users: z.array(z.object({
        id: z.string(),
        name: z.string(),
    })).optional().default([]),
    users_count: z.number().optional().default(0),
    roles_count: z.number().optional().default(0),
    created_at: z.string(),
    updated_at: z.string(),
})

export type Role = z.infer<typeof roleSchema>
export type Permission = z.infer<typeof permissionSchema>

