import { z } from 'zod'

export const taskTypeStatusEnum = z.enum(['Active', 'Inactive'])
export type TaskTypeStatus = z.infer<typeof taskTypeStatusEnum>

export const taskTypeSchema = z.object({
  id: z.string(),
  task_en: z.string(),
  task_ar: z.string(),
  status: taskTypeStatusEnum,
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export type TaskType = z.infer<typeof taskTypeSchema>

export const createTaskTypeSchema = z.object({
  task_en: z.string().min(1, 'يرجى إدخال النوع بالإنجليزية'),
  task_ar: z.string().min(1, 'يرجى إدخال النوع بالعربية'),
  status: taskTypeStatusEnum,
})

export type CreateTaskType = z.infer<typeof createTaskTypeSchema>

export const updateTaskTypeSchema = z.object({
  task_en: z.string().min(1, 'يرجى إدخال النوع بالإنجليزية').optional(),
  task_ar: z.string().min(1, 'يرجى إدخال النوع بالعربية').optional(),
  status: taskTypeStatusEnum.optional(),
})

export type UpdateTaskType = z.infer<typeof updateTaskTypeSchema>

