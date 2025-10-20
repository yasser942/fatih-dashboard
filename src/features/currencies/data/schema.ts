import { z } from 'zod'

export const currencySchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'اسم العملة مطلوب'),
    symbol: z.string().min(1, 'رمز العملة مطلوب'),
    code: z.string().length(3, 'رمز العملة يجب أن يكون 3 أحرف'),
    is_active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
})

export const createCurrencySchema = z.object({
    name: z.string().min(1, 'اسم العملة مطلوب'),
    symbol: z.string().min(1, 'رمز العملة مطلوب'),
    code: z.string().length(3, 'رمز العملة يجب أن يكون 3 أحرف'),
    is_active: z.boolean().default(true),
})

export const updateCurrencySchema = z.object({
    name: z.string().min(1, 'اسم العملة مطلوب').optional(),
    symbol: z.string().min(1, 'رمز العملة مطلوب').optional(),
    code: z.string().length(3, 'رمز العملة يجب أن يكون 3 أحرف').optional(),
    is_active: z.boolean().optional(),
})

export type Currency = z.infer<typeof currencySchema>
export type CreateCurrency = z.infer<typeof createCurrencySchema>
export type UpdateCurrency = z.infer<typeof updateCurrencySchema>

