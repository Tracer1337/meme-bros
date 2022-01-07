import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
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
    app.enableCors()
    await app.listen(5000)
}

bootstrap()
