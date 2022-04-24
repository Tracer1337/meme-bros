import { Role } from "../../roles/role.enum"

export interface User {
    id: string,
    username: string,
    roles: Role[]
}
