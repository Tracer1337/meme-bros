import { APP_INTERCEPTOR } from "@nestjs/core"
import { Module, ClassSerializerInterceptor } from "@nestjs/common"
import { TemplateModule } from "./template/template.module"

@Module({
    imports: [TemplateModule],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor
        }
    ]
})
export class AppModule {}
