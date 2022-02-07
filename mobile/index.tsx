import React from "react"
import { AppRegistry, NativeModules } from "react-native"
import App from "@meme-bros/app"
import {
    BridgeProvider,
    SharedContextProvider,
    ModulesProvider
} from "@meme-bros/client-lib"
import { name as appName } from "./app.json"

function Main() {
    return (
        <ModulesProvider modules={{
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
        </ModulesProvider>
    )
}

AppRegistry.registerComponent(appName, () => Main)
