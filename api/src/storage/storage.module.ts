import { Module } from "@nestjs/common"
import { ConfigModule, ConfigType } from "@nestjs/config"
import * as minio from "minio"
import { storageConfig } from "./storage.config"
import { StorageController } from "./storage.controller"
import { StorageService } from "./storage.service"

@Module({
    imports: [ConfigModule.forFeature(storageConfig)],
    controllers: [StorageController],
    providers: [
        StorageService,
        {
            provide: "MINIO",
            useFactory: (config: ConfigType<typeof storageConfig>) => {
                return new minio.Client(config)
            },
            inject: [storageConfig.KEY]
        }
    ],
    exports: [StorageService]
})
export class StorageModule {}
