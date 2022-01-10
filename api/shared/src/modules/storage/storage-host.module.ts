import { Global, Module } from "@nestjs/common"
import { StorageService } from "./storage.service"
import { STORAGE_OPTIONS_KEY, STORAGE_SERVICE_KEY } from "./constants"

@Global()
@Module({
    providers: [
        {
            provide: STORAGE_OPTIONS_KEY,
            useFactory: () => ({})
        },
        {
            provide: STORAGE_SERVICE_KEY,
            useClass: StorageService
        }
    ],
    exports: [STORAGE_OPTIONS_KEY, STORAGE_SERVICE_KEY]
})
export class StorageHostModule {}
