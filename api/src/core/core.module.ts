import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { HttpModule } from "@nestjs/axios"
import { CoreService } from "./core.service"

@Module({
    imports: [ConfigModule, HttpModule],
    providers: [CoreService],
    exports: [CoreService]
})
export class CoreModule {}
