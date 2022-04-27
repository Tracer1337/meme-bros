import { Inject, Injectable } from "@nestjs/common"
import { ConfigService, ConfigType } from "@nestjs/config"
import { ImgurClient } from "imgur"
import { getBase64FromDataURI } from "@meme-bros/shared"
import { imgurConfig } from "./imgur.config"

@Injectable()
export class ImgurService {
    private api: ImgurClient
    
    constructor(
        @Inject(imgurConfig.KEY)
        readonly config: ConfigType<typeof imgurConfig>
    ) {
        this.api = new ImgurClient({
            clientId: config.clientId
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
