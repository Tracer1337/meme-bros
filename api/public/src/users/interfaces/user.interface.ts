import { Role } from "src/roles/role.enum"

export interface User {
    id: string,
    username: string,
    roles: Set<Role>
}
