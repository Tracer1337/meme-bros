import { AppRegistry } from "react-native"
import App from "@meme-bros/app"
import { APIProvider } from "@meme-bros/api-sdk"
import {
    BridgeProvider,
    SharedContextProvider,
    ModulesProvider
} from "@meme-bros/client-lib"
import { name as appName } from "./app.json"
import { useCoreModule } from "./src/modules/core"
import { useTemplatesModule } from "./src/modules/templates"
import { useStorageModule } from "./src/modules/storage"
import { useCanvasModule } from "./src/modules/canvas"
import { useViewModule } from "./src/modules/view"
import { usePermissionsModule } from "./src/modules/permissions"
import { useSocialModule } from "./src/modules/social"
import { useSyncModule } from "./src/modules/sync"
import { useStickersModule } from "./src/modules/stickers"

function Main() {
    return (
        <ModulesProvider modules={{
            core: useCoreModule(),
            sync: useSyncModule(),
            templates: useTemplatesModule(),
            stickers: useStickersModule(),
            storage: useStorageModule(),
            canvas: useCanvasModule(),
            view: useViewModule(),
            permissions: usePermissionsModule(),
            social: useSocialModule()
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
        <APIProvider config={{
            host: process.env.PUBLIC_API_HOST || "http://10.0.2.2:6006"
        }}>
            <Main/>
        </APIProvider>
    )
}

AppRegistry.registerComponent(appName, () => MainWrapper)
