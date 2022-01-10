import { DynamicModule, Module } from "@nestjs/common"
import { StorageHostModule } from "./storage-host.module"
import { StorageController } from "./storage.controller"
import { StorageService } from "./storage.service"
import { STORAGE_SERVICE_KEY, STORAGE_OPTIONS_KEY } from "./constants"
import { StorageModuleAsyncOptions } from "./interfaces/storage-module-async-options.interface"

@Module({
    imports: [StorageHostModule],
    providers: [
        {
            provide: StorageService,
            useExisting: STORAGE_SERVICE_KEY
        }
    ],
    exports: [StorageHostModule, StorageService]
})
export class StorageModule {
    static forRootAsync(options: StorageModuleAsyncOptions): DynamicModule {
        return {
            module: StorageModule,
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
