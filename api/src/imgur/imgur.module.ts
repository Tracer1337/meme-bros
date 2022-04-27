import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ImgurService } from "./imgur.service"

@Module({
    imports: [ConfigModule],
    providers: [ImgurService],
    exports: [ImgurService]
})
export class ImgurModule {}
