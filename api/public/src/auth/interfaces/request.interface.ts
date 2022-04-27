import { User } from "src/users/interfaces/user.interface"

export interface AuthorizedRequest extends Request {
    user: User
}
