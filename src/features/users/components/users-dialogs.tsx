import { UsersMutateDrawer } from './users-mutate-drawer'
import { UsersDeleteDialog } from './users-delete-dialog'
import { UsersRolesDialog } from './users-roles-dialog'
import { UsersPermissionsDialog } from './users-permissions-dialog'

export function UsersDialogs() {
  return (
    <>
      <UsersMutateDrawer />
      <UsersDeleteDialog />
      <UsersRolesDialog />
      <UsersPermissionsDialog />
    </>
  )
}
