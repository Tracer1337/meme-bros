import React from "react"
import { AppRegistry } from "react-native"
import { DarkTheme, Provider as PaperProvider } from "react-native-paper"
import App from "./src/App"
import { name as appName } from "./app.json"
import { DialogProvider } from "./src/lib/DialogHandler"
import { BridgeProvider, SharedContextProvider } from "@meme-bros/shared"

function Main() {
    return (
        <PaperProvider theme={DarkTheme}>
            <BridgeProvider>
                <SharedContextProvider>
                    <DialogProvider>
                        <App/>
                    </DialogProvider>
                </SharedContextProvider>
            </BridgeProvider>
        </PaperProvider>
    )
}

AppRegistry.registerComponent(appName, () => Main)
