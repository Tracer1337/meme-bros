import React from "react"
import { AppRegistry } from "react-native"
import App from "@meme-bros/app"
import { BridgeProvider, SharedContextProvider } from "@meme-bros/shared"
import { name as appName } from "./app.json"

function Main() {
    return (
        <BridgeProvider>
            <SharedContextProvider>
                <App/>
            </SharedContextProvider>
        </BridgeProvider>
    )
}

AppRegistry.registerComponent(appName, () => Main)
