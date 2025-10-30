import { createFileRoute } from '@tanstack/react-router'
import TaskTypes from '@/features/task-types'

export const Route = createFileRoute('/_authenticated/task-types/')({
    component: TaskTypes,
})
