import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { imgurConfig } from "./imgur.config"
import { ImgurService } from "./imgur.service"

@Module({
    imports: [ConfigModule.forFeature(imgurConfig)],
    providers: [ImgurService],
    exports: [ImgurService]
})
export class ImgurModule {}
