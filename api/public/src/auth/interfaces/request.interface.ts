import { Role } from "../../roles/role.enum"

export interface AuthorizedRequest extends Request {
    user: {
        id: string,
        username: string,
        roles: Role[]
    }
}
