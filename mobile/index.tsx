import React from "react"
import { AppRegistry } from "react-native"
import App from "@meme-bros/app"
import {
    BridgeProvider,
    SharedContextProvider,
    ModulesProvider
} from "@meme-bros/client-lib"
import { name as appName } from "./app.json"
import coreModules from "./modules/core"

function Main() {
    return (
        <ModulesProvider modules={{
            core: coreModules
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
