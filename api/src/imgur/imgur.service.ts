import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { ImgurClient } from "imgur"
import { getBase64FromDataURI } from "@meme-bros/shared"

@Injectable()
export class ImgurService {
    private api: ImgurClient
    
    constructor(
        private readonly configService: ConfigService
    ) {
        this.api = new ImgurClient({
            clientId: this.configService.get<string>("imgur.clientId")
        })
    }

    public uploadImage(dataURI: string) {
        return this.api.upload({
            image: getBase64FromDataURI(dataURI),
            type: "base64",
            description: "Made with MemeBros"
        })
    }

    public deleteImage(deletehash: string) {
        return this.api.deleteImage(deletehash)
    }
}
