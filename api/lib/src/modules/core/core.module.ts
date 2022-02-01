import { DynamicModule, Module } from "@nestjs/common"
import { HttpModule } from "@nestjs/axios"
import { CoreService } from "./core.service"
import { CORE_OPTIONS_KEY } from "./constants"
import { CoreModuleAsyncOptions } from "./interfaces/core-module-async-options.interface"

@Module({})
export class CoreModule {
    static forRootAsync(options: CoreModuleAsyncOptions): DynamicModule {
        return {
            module: CoreModule,
            global: true,
            imports: [...options.imports, HttpModule],
            providers: [
                CoreService,
                {
                    provide: CORE_OPTIONS_KEY,
                    useFactory: options.useFactory,
                    inject: options.inject 
                }
            ],
            exports: [CoreService]
        }
    }
}
