import { DynamicModule, Module } from "@nestjs/common"
import { StorageController } from "./storage.controller"
import { StorageService } from "./storage.service"
import { STORAGE_OPTIONS_KEY } from "./constants"
import { StorageModuleAsyncOptions } from "./interfaces/storage-module-async-options.interface"

@Module({})
export class StorageModule {
    static forRootAsync(options: StorageModuleAsyncOptions): DynamicModule {
        return {
            module: StorageModule, 
            global: true,
            imports: options.imports,
            providers: [
                StorageService,
                {
                    provide: STORAGE_OPTIONS_KEY,
                    useFactory: options.useFactory,
                    inject: options.inject
                }
            ],
            controllers: [StorageController],
            exports: [StorageService]
        }
    }
}
