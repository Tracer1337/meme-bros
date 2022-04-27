import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common"
import { instanceToPlain } from "class-transformer"
import { map, Observable } from "rxjs"
import { AuthorizedRequest } from "../auth/interfaces/request.interface"

export class ClassSerializerInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next
            .handle()
            .pipe(
                map((data) => this.serialize(data, context))
            )
    }

    private serialize(data: any, context: ExecutionContext){
        const { user } = context.switchToHttp().getRequest() as AuthorizedRequest
        return instanceToPlain(data, {
            groups: user ? Array.from(user.roles) : []
        })
    }
}
