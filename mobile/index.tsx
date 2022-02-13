import React from "react"
import { AppRegistry } from "react-native"
import App from "@meme-bros/app"
import { PublicAPIProvider } from "@meme-bros/api-sdk"
import {
    BridgeProvider,
    SharedContextProvider,
    ModulesProvider
} from "@meme-bros/client-lib"
import { name as appName } from "./app.json"
import coreModule from "./src/modules/core"
import { useTemplateModule } from "./src/modules/templates"
import storageModule from "./src/modules/storage"
import canvasModule from "./src/modules/canvas"
import viewModule from "./src/modules/view"
import permissionsModule from "./src/modules/permissions"
import socialModule from "./src/modules/social"

function Main() {
    return (
        <ModulesProvider modules={{
            core: coreModule,
            templates: useTemplateModule(),
            storage: storageModule,
            canvas: canvasModule,
            view: viewModule,
            permissions: permissionsModule,
            social: socialModule
        }}>
            <BridgeProvider>
                <SharedContextProvider>
                    <App/>
                </SharedContextProvider>
            </BridgeProvider>
        </ModulesProvider>
    )
}

function MainWrapper() {
    return (
        <PublicAPIProvider config={{
            host: process.env.PUBLIC_API_HOST || "http://10.0.2.2:6006"
        }}>
            <Main/>
        </PublicAPIProvider>
    )
}

AppRegistry.registerComponent(appName, () => MainWrapper)
