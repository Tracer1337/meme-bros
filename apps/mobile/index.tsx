import React from "react"
import { AppRegistry, NativeModules } from "react-native"
import App from "@meme-bros/app"
import {
    BridgeProvider,
    SharedContextProvider,
    NativeModulesProvider
} from "@meme-bros/shared"
import { name as appName } from "./app.json"

function Main() {
    return (
        <NativeModulesProvider modules={{
            core: {
                render(canvas) {
                    return NativeModules.CoreModule.render(
                        JSON.stringify(canvas)
                    )
                }
            }
        }}>
            <BridgeProvider>
                <SharedContextProvider>
                    <App/>
                </SharedContextProvider>
            </BridgeProvider>
        </NativeModulesProvider>
    )
}

AppRegistry.registerComponent(appName, () => Main)
