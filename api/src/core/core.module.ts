import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { HttpModule } from "@nestjs/axios"
import { CoreService } from "./core.service"
import { coreConfig } from "./core.config"

@Module({
    imports: [
        ConfigModule.forFeature(coreConfig),
        HttpModule
    ],
    providers: [CoreService],
    exports: [CoreService]
})
export class CoreModule {}
