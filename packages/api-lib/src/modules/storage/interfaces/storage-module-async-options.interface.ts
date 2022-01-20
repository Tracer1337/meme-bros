import { ModuleMetadata } from "@nestjs/common"
import { StorageModuleOptions } from "./storage-module-options.interface"

export interface StorageModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    inject: any[],
    useFactory: (...args: any[]) => Promise<StorageModuleOptions> | StorageModuleOptions
}
