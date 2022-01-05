import React from "react"
import { DarkTheme, Provider as PaperProvider, Portal } from "react-native-paper"
import Navigator from "./Navigator"
import { DialogProvider } from "./lib/DialogHandler"

function App() {
    return (
        <PaperProvider theme={DarkTheme}>
            <DialogProvider>
                <Portal.Host>
                    <Navigator/>
                </Portal.Host>
            </DialogProvider>
        </PaperProvider>
    )
}

export default App
