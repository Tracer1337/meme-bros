import { ModuleMetadata } from "@nestjs/common"
import { CoreModuleOptions } from "./core-module-options.interface"

export interface CoreModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    inject: any[],
    useFactory: (...args: any[]) => Promise<CoreModuleOptions> | CoreModuleOptions
}
