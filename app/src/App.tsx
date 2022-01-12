import React from "react"
import { DarkTheme, Provider as PaperProvider, Portal } from "react-native-paper"
import Navigator from "./Navigator"
import { DialogProvider } from "./lib/DialogHandler"
import { useTemplatesSync } from "./components/templates/utils/sync"
import { AppContextProvider } from "./lib/context"

function TemplatesSync() {
    useTemplatesSync()
    return null
}

function App() {
    return (
        <PaperProvider theme={DarkTheme}>
            <AppContextProvider>
                <TemplatesSync/>
                <DialogProvider>
                    <Portal.Host>
                        <Navigator/>
                    </Portal.Host>
                </DialogProvider>
            </AppContextProvider>
        </PaperProvider>
    )
}

export default App
