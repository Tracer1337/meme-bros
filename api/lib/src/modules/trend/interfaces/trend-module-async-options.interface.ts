import { ModuleMetadata } from "@nestjs/common"
import { TrendModuleOptions } from "./trend-module-options.interface"

export interface TrendModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    inject: any[],
    useFactory: (...args: any[]) => Promise<TrendModuleOptions> | TrendModuleOptions
}
