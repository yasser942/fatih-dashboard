import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Permissions } from '@/features/permissions'

const permissionSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/permissions/')({
  validateSearch: permissionSearchSchema,
  component: Permissions,
})