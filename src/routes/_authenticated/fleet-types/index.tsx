import { createFileRoute } from '@tanstack/react-router'
import FleetTypes from '@/features/fleet-types'

export const Route = createFileRoute('/_authenticated/fleet-types/')({
    component: FleetTypes,
})
