import { Inject, Injectable } from "@nestjs/common"
import { ImgurClient } from "imgur"
import { getBase64FromDataURI } from "@meme-bros/shared"
import { IMGUR_OPTIONS_KEY } from "./constants"
import { ImgurModuleOptions } from "./interfaces/imgur-module-options.interface"

@Injectable()
export class ImgurService {
    private api: ImgurClient
    
    constructor(@Inject(IMGUR_OPTIONS_KEY) options: ImgurModuleOptions) {
        this.api = new ImgurClient({
            clientId: options.clientId
        })
    }

    public uploadImage(dataURI: string) {
        return this.api.upload({
            image: getBase64FromDataURI(dataURI),
            type: "base64",
            description: "Made with MemeBros"
        })
    }
}
