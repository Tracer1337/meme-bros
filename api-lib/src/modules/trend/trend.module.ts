import { DynamicModule, Module } from "@nestjs/common"
import { HttpModule } from "@nestjs/axios"
import { TrendService } from "./trend.service"
import { TREND_OPTIONS_KEY } from "./constants"
import { TrendModuleAsyncOptions } from "./interfaces/trend-module-async-options.interface"

@Module({})
export class TrendModule {
    static forRootAsync(options: TrendModuleAsyncOptions): DynamicModule {
        return {
            module: TrendModule,
            global: true,
            imports: [...options.imports, HttpModule],
            providers: [
                TrendService,
                {
                    provide: TREND_OPTIONS_KEY,
                    useFactory: options.useFactory,
                    inject: options.inject 
                }
            ],
            exports: [TrendService]
        }
    }
}
