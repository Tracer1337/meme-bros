import { ClassSerializerInterceptor, Module } from "@nestjs/common"
import { APP_INTERCEPTOR } from "@nestjs/core"
import { MongooseModule } from "@nestjs/mongoose"
import { TemplatesModule } from "./templates/templates.module"

@Module({
    imports: [
        MongooseModule.forRoot("mongodb://localhost/meme-bros"),
        TemplatesModule
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor
        }
    ]
})
export class AppModule {}
