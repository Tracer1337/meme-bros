import React from "react"
import { DarkTheme, Provider as PaperProvider, Portal } from "react-native-paper"
import { api } from "@meme-bros/api-sdk"
import Navigator from "./Navigator"
import { DialogProvider } from "./lib/DialogHandler"
import { useTemplatesSync } from "./components/templates/utils/sync"
import { AppContextProvider } from "./lib/context"

api.setConfig({
    host: process.env.API_HOST || "http://10.0.2.2:6000"
})

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
