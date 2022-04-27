import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { ConfigService } from "@nestjs/config"
import * as bodyParser from "body-parser"
import { useContainer } from "class-validator"
import { AppModule } from "./app/app.module"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const configService = app.get(ConfigService)
    useContainer(app.select(AppModule), {
        fallbackOnErrors: true
    })
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true
    }))
    app.use(bodyParser.json({ limit: "5mb" }))
    app.enableCors()
    await app.listen(configService.get("port"))
}

bootstrap()
