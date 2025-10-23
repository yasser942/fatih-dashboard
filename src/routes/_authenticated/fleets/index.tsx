import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Fleets } from '@/features/fleets'

const fleetsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(15),
})

export const Route = createFileRoute('/_authenticated/fleets/')({
  validateSearch: fleetsSearchSchema,
  component: Fleets,
})