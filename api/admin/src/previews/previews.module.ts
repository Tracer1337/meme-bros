import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PreviewsService } from "./previews.service"

@Module({
    imports: [ConfigModule],
    providers: [PreviewsService],
    exports: [PreviewsService]
})
export class PreviewsModule {}
