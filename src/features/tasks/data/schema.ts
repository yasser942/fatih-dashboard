import { z } from 'zod'

export const taskStatusValues = ['assigned', 'in_progress', 'done', 'cancelled', 'failed', 'reassigned'] as const
export type TaskStatus = typeof taskStatusValues[number]

export const taskSchema = z.object({
  id: z.string(),
  order_id: z.string(),
  order: z.object({
    id: z.string(),
    qr_code: z.string(),
  }).nullable().optional(),
  user_id: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }).nullable().optional(),
  vehicle_id: z.string(),
  vehicle: z.object({
    id: z.string(),
    plate_number: z.string(),
  }).nullable().optional(),
  from_branch_id: z.string().nullable().optional(),
  fromBranch: z.object({
    id: z.string(),
    name: z.string(),
  }).nullable().optional(),
  to_branch_id: z.string().nullable().optional(),
  toBranch: z.object({
    id: z.string(),
    name: z.string(),
  }).nullable().optional(),
  from_customer_id: z.string().nullable().optional(),
  fromCustomer: z.object({
    id: z.string(),
    market_name: z.string().optional(),
  }).nullable().optional(),
  to_customer_id: z.string().nullable().optional(),
  toCustomer: z.object({
    id: z.string(),
    market_name: z.string().optional(),
  }).nullable().optional(),
  task_type_id: z.string(),
  taskType: z.object({
    id: z.string(),
    task_en: z.string(),
    task_ar: z.string(),
  }).nullable().optional(),
  current_status: z.enum(taskStatusValues),
  previous_status: z.enum(taskStatusValues).nullable().optional(),
  completed_at: z.string().nullable().optional(),
  reason_for_cancellation: z.string().nullable().optional(),
  is_auto_created: z.boolean(),
  created_by: z.string().nullable().optional(),
  createdBy: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }).nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export type Task = z.infer<typeof taskSchema>

export const createTaskSchema = z.object({
  order_id: z.any().optional(),
  user_id: z.any().optional(),
  vehicle_id: z.any().optional(),
  from_branch_id: z.preprocess(
    (val) => (val === undefined || val === null || val === '' || val === 'none' ? null : Number(val)),
    z.number().nullable().optional()
  ),
  to_branch_id: z.preprocess(
    (val) => (val === undefined || val === null || val === '' || val === 'none' ? null : Number(val)),
    z.number().nullable().optional()
  ),
  from_customer_id: z.preprocess(
    (val) => (val === undefined || val === null || val === '' || val === 'none' ? null : Number(val)),
    z.number().nullable().optional()
  ),
  to_customer_id: z.preprocess(
    (val) => (val === undefined || val === null || val === '' || val === 'none' ? null : Number(val)),
    z.number().nullable().optional()
  ),
  task_type_id: z.any().optional(),
  current_status: z.enum(taskStatusValues, {
    required_error: 'حالة المهمة مطلوبة',
    invalid_type_error: 'يجب اختيار حالة صحيحة للمهمة',
  }),
  previous_status: z.enum(taskStatusValues, {
    invalid_type_error: 'يجب اختيار حالة سابقة صحيحة',
  }).optional().nullable(),
  completed_at: z.string({
    invalid_type_error: 'تاريخ الإنجاز غير صحيح',
  }).optional().nullable(),
  reason_for_cancellation: z.string({
    invalid_type_error: 'سبب الإلغاء يجب أن يكون نص',
  }).optional().nullable(),
  is_auto_created: z.boolean({
    invalid_type_error: 'قيمة غير صحيحة',
  }).default(false),
}).superRefine((data, ctx) => {
  // Validate and transform order_id
  const orderId = data.order_id
  if (orderId === undefined || orderId === null || orderId === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['order_id'],
      message: 'يجب اختيار الطلب المرتبط بالمهمة',
    })
  } else {
    const num = Number(orderId)
    if (isNaN(num) || num < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['order_id'],
        message: 'يجب اختيار الطلب المرتبط بالمهمة',
      })
    } else {
      // Transform to number
      ;(data as any).order_id = num
    }
  }

  // Validate and transform user_id
  const userId = data.user_id
  if (userId === undefined || userId === null || userId === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['user_id'],
      message: 'يجب اختيار المستخدم المسؤول عن تنفيذ المهمة',
    })
  } else {
    const num = Number(userId)
    if (isNaN(num) || num < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['user_id'],
        message: 'يجب اختيار المستخدم المسؤول عن تنفيذ المهمة',
      })
    } else {
      ;(data as any).user_id = num
    }
  }

  // Validate and transform vehicle_id
  const vehicleId = data.vehicle_id
  if (vehicleId === undefined || vehicleId === null || vehicleId === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['vehicle_id'],
      message: 'يجب اختيار المركبة المستخدمة للمهمة',
    })
  } else {
    const num = Number(vehicleId)
    if (isNaN(num) || num < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['vehicle_id'],
        message: 'يجب اختيار المركبة المستخدمة للمهمة',
      })
    } else {
      ;(data as any).vehicle_id = num
    }
  }

  // Validate and transform task_type_id
  const taskTypeId = data.task_type_id
  if (taskTypeId === undefined || taskTypeId === null || taskTypeId === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['task_type_id'],
      message: 'يجب اختيار نوع المهمة المطلوبة',
    })
  } else {
    const num = Number(taskTypeId)
    if (isNaN(num) || num < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['task_type_id'],
        message: 'يجب اختيار نوع المهمة المطلوبة',
      })
    } else {
      ;(data as any).task_type_id = num
    }
  }
})

export const updateTaskSchema = createTaskSchema.partial().passthrough()

export type CreateTask = z.infer<typeof createTaskSchema>
export type UpdateTask = z.infer<typeof updateTaskSchema>

export type PaginatorInfo = {
  count: number
  currentPage: number
  firstItem?: number
  hasMorePages: boolean
  lastItem?: number
  perPage: number
  total: number
}

export type TasksPaginatedResponse = {
  data: Task[]
  paginatorInfo: PaginatorInfo
}
