import React from "react"
import { Platform } from "react-native"
import { DarkTheme, Provider as PaperProvider, Portal } from "react-native-paper"
import { api } from "@meme-bros/api-sdk"
import Navigator from "./Navigator"
import ResourceLoader from "./ResourceLoader"
import { DialogProvider } from "./lib/DialogHandler"
import { AppContextProvider } from "./lib/context"
import { SnackbarProvider } from "./lib/snackbar"

api.setConfig({
    host: process.env.API_HOST || Platform.select({
        android: "http://10.0.2.2:6006",
        default: "http://localhost:6006"
    })
})

function App() {
    return (
        <PaperProvider theme={DarkTheme}>
            <AppContextProvider>
                <ResourceLoader/>
                <DialogProvider>
                    <SnackbarProvider>
                        <Portal.Host>
                            <Navigator/>
                        </Portal.Host>
                    </SnackbarProvider>
                </DialogProvider>
            </AppContextProvider>
        </PaperProvider>
    )
}

export default App
