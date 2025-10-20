import { createFileRoute } from '@tanstack/react-router'
import { LocationMasters } from '@/features/location-masters'

export const Route = createFileRoute('/_authenticated/location-masters/')({
  component: LocationMasters,
})
