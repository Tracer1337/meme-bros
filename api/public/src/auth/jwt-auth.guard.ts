import { ExecutionContext, Injectable } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { Role } from "../roles/role.enum"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    handleRequest(_err: any, user: any) {
        if (!user) {
            return { roles: [Role.PUBLIC] }
        }
        return user
    }

    async canActivate(context: ExecutionContext) {
        await super.canActivate(context)
        return true
    }
}
