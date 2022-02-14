import { ModuleMetadata } from "@nestjs/common"
import { ImgurModuleOptions } from "./imgur-module-options.interface"

export interface ImgurModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    inject: any[],
    useFactory: (...args: any[]) => Promise<ImgurModuleOptions> | ImgurModuleOptions
}
