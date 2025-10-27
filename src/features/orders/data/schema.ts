import { z } from 'zod'

export const orderStatusValues = ['registered', 'received', 'transfer', 'delivered', 'canceled', 'draft'] as const
export type OrderStatus = typeof orderStatusValues[number]

export const cancellationReasonValues = ['CanceledBySender', 'CanceledByReceiver', 'CanceledDueToNoResponse', 'CanceledDueToFees'] as const
export type CancellationReason = typeof cancellationReasonValues[number]

export const feesTypeValues = ['sender', 'receiver'] as const
export type FeesType = typeof feesTypeValues[number]

export type Order = {
    id: number
    qr_code: string
    status: OrderStatus
    cancellation_reason?: CancellationReason | null
    branch_source_id: number
    branchSource?: {
        id: number
        name: string
    }
    branch_target_id: number
    branchTarget?: {
        id: number
        name: string
    }
    sender_id: number
    sender?: {
        id: number
        name: string
        email: string
    }
    receiver_id: number
    receiver?: {
        id: number
        name: string
        email: string
    }
    created_by: number
    createdBy?: {
        id: number
        name: string
        email: string
    }
    transfer_date?: string | null
    delivery_date?: string | null
    fees_type: FeesType
    shipping_fees: number
    fees_currency_id: number
    feesCurrency?: {
        id: number
        name: string
        code: string
    }
    cash_on_delivery: number
    cod_currency_id: number
    codCurrency?: {
        id: number
        name: string
        code: string
    }
    created_at?: string
    updated_at?: string
}

export const createOrderSchema = z.object({
    qr_code: z.string().min(1, 'يجب إدخال رمز QR'),
    status: z.enum(orderStatusValues),
    cancellation_reason: z.enum(cancellationReasonValues).optional(),
    branch_source_id: z.coerce.number().min(1, 'يجب اختيار فرع المصدر'),
    branch_target_id: z.coerce.number().min(1, 'يجب اختيار فرع الوجهة'),
    sender_id: z.coerce.number().min(1, 'يجب اختيار المرسل'),
    receiver_id: z.coerce.number().min(1, 'يجب اختيار المستقبل'),
    fees_type: z.enum(feesTypeValues),
    shipping_fees: z.coerce.number().min(0, 'رسوم الشحن يجب أن تكون أكبر من أو تساوي 0'),
    fees_currency_id: z.coerce.number().min(1, 'يجب اختيار عملة الرسوم'),
    cash_on_delivery: z.coerce.number().min(0, 'الدفع عند الاستلام يجب أن يكون أكبر من أو يساوي 0'),
    cod_currency_id: z.coerce.number().min(1, 'يجب اختيار عملة الدفع عند الاستلام'),
})

export const updateOrderSchema = createOrderSchema.partial().passthrough()

export type CreateOrder = z.infer<typeof createOrderSchema>
export type UpdateOrder = z.infer<typeof updateOrderSchema>

export type PaginatorInfo = {
    count: number
    currentPage: number
    firstItem?: number
    hasMorePages: boolean
    lastItem?: number
    perPage: number
    total: number
}

export type OrdersPaginatedResponse = {
    data: Order[]
    paginatorInfo: PaginatorInfo
}
