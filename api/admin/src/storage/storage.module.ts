import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { StorageController } from "./storage.controller"
import { StorageService } from "./storage.service"

@Module({
    imports: [ConfigModule],
    providers: [StorageService],
    controllers: [StorageController],
    exports: [StorageService]
})
export class StorageModule {}
