import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Roles } from '@/features/roles'

const roleSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/roles/')({
  validateSearch: roleSearchSchema,
  component: Roles,
})