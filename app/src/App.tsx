import React from "react"
import { DarkTheme, Provider as PaperProvider, Portal } from "react-native-paper"
import Navigator from "./Navigator"
import { DialogProvider } from "./lib/DialogHandler"
import { useTemplatesSync } from "./components/templates/utils/sync"

function App() {
    useTemplatesSync()

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
