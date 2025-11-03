import { gql } from '@apollo/client/core'

export const CREATE_TASK_TYPE = gql`
  mutation CreateTaskType($task_en: String!, $task_ar: String!, $status: TaskTypeStatus!) {
    createTaskType(task_en: $task_en, task_ar: $task_ar, status: $status) {
      id
      task_en
      task_ar
      status
      created_at
      updated_at
    }
  }
`

export const UPDATE_TASK_TYPE = gql`
  mutation UpdateTaskType($id: ID!, $task_en: String, $task_ar: String, $status: TaskTypeStatus) {
    updateTaskType(id: $id, task_en: $task_en, task_ar: $task_ar, status: $status) {
      id
      task_en
      task_ar
      status
      created_at
      updated_at
    }
  }
`

export const DELETE_TASK_TYPE = gql`
  mutation DeleteTaskType($id: ID!) {
    deleteTaskType(id: $id) {
      id
    }
  }
`






