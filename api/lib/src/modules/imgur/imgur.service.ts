import { Inject, Injectable } from "@nestjs/common"
import { ImgurClient } from "imgur"
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
        const base64 = dataURI.split(",")[1]
        return this.api.upload({
            image: base64,
            type: "base64",
            description: "Made with MemeBros"
        })
    }
}
