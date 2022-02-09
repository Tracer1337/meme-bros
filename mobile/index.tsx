import React from "react"
import { AppRegistry } from "react-native"
import App from "@meme-bros/app"
import {
    BridgeProvider,
    SharedContextProvider,
    ModulesProvider
} from "@meme-bros/client-lib"
import { name as appName } from "./app.json"
import coreModule from "./src/modules/core"
import templatesModule from "./src/modules/templates"
import storageModule from "./src/modules/storage"
import canvasModule from "./src/modules/canvas"
import viewModule from "./src/modules/view"
import permissionsModule from "./src/modules/permissions"

function Main() {
    return (
        <ModulesProvider modules={{
            core: coreModule,
            templates: templatesModule,
            storage: storageModule,
            canvas: canvasModule,
            view: viewModule,
            permissions: permissionsModule
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
