import { createFileRoute } from '@tanstack/react-router'
import { Fleets } from '@/features/fleets'

export const Route = createFileRoute('/_authenticated/fleets/')({
  component: Fleets,
})