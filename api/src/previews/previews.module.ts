import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { CoreModule } from "../core/core.module"
import { StorageModule } from "../storage/storage.module"
import { PreviewsService } from "./previews.service"

@Module({
    imports: [ConfigModule, CoreModule, StorageModule],
    providers: [PreviewsService],
    exports: [PreviewsService]
})
export class PreviewsModule {}
