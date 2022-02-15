import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { ImgurService } from "@meme-bros/api-lib"
import { UploadImageDTO } from "./dto/upload-image.dto"

@Injectable()
export class UploadService {
    constructor(
        private readonly imgurService: ImgurService
    ) {}

    public async uploadImage(uploadImageDTO: UploadImageDTO) {
        const res = await this.imgurService.uploadImage(uploadImageDTO.uri)
        console.log(res)
        if (!res.success) {
            throw new InternalServerErrorException()
        }
        return res.data.link
    }
}
