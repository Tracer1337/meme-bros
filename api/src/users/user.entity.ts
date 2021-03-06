import { Exclude } from "class-transformer"
import { User } from "./interfaces/user.interface"
import { Role } from "../roles/role.enum"

export class UserEntity implements User {
    id: string

    username: string

    @Exclude()
    roles: Set<Role>

    constructor(user: User) {
        Object.assign(this, user)
    }
}
