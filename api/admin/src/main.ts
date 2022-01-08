import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import * as bodyParser from "body-parser"
import { useContainer } from "class-validator"
import { AppModule } from "./app.module"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    useContainer(app.select(AppModule), {
        fallbackOnErrors: true
    })
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true
    }))
    app.use(bodyParser.json({ limit: "5mb" }))
    app.enableCors()
    await app.listen(5000)
}

bootstrap()
