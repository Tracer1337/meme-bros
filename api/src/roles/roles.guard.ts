import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AuthorizedRequest } from "../auth/interfaces/request.interface"
import { Role } from "./role.enum"
import { ROLES_KEY } from "./roles.decorator"

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ])
        if (!requiredRoles) {
            return true
        }
        const { user } = context.switchToHttp().getRequest() as AuthorizedRequest
        if (user.roles.has(Role.ADMIN)) {
            return true
        }
        const hasRole = requiredRoles.some((role) => user.roles.has(role))
        if (!hasRole && user.roles.has(Role.PUBLIC)) {
            throw new UnauthorizedException()
        }
        return hasRole
    }
}
