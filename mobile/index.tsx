import React from "react"
import { AppRegistry } from "react-native"
import { DarkTheme, Provider as PaperProvider } from "react-native-paper"
import App from "./src/App"
import { name as appName } from "./app.json"
import { DialogProvider } from "./src/lib/DialogHandler"

function Main() {
    return (
        <PaperProvider theme={DarkTheme}>
            <DialogProvider>
                <App/>
            </DialogProvider>
        </PaperProvider>
    )
}

AppRegistry.registerComponent(appName, () => Main)
