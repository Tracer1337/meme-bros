import { User } from "../../users/interfaces/user.interface"

export interface AuthorizedRequest extends Request {
    user: User
}
