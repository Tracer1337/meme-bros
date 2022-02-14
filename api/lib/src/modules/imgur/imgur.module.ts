import { DynamicModule, Module } from "@nestjs/common"
import { ImgurService } from "./imgur.service"
import { IMGUR_OPTIONS_KEY } from "./constants"
import { ImgurModuleAsyncOptions } from "./interfaces/imgur-module-async-options.interface"

@Module({})
export class ImgurModule {
    static forRootAsync(options: ImgurModuleAsyncOptions): DynamicModule {
        return {
            module: ImgurModule,
            global: true,
            imports: options.imports,
            providers: [
                ImgurService,
                {
                    provide: IMGUR_OPTIONS_KEY,
                    useFactory: options.useFactory,
                    inject: options.inject 
                }
            ],
            exports: [ImgurService]
        }
    }
}
