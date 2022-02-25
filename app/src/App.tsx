import React from "react"
import { DarkTheme, Portal, Provider as PaperProvider } from "react-native-paper"
import { DialogProvider } from "./lib/DialogHandler"
import Router from "./components/router/Router"
import { AppContextProvider } from "./lib/context"
import { SnackbarProvider } from "./lib/snackbar"
import { useResources } from "./lib/resources"

function ResourceLoader() {
    useResources()
    return null
}

function App() {
    return (
        <PaperProvider theme={DarkTheme}>
            <AppContextProvider>
                <ResourceLoader/>
                <Portal.Host>
                    <DialogProvider>
                        <SnackbarProvider>
                                <Router/>
                        </SnackbarProvider>
                    </DialogProvider>
                </Portal.Host>
            </AppContextProvider>
        </PaperProvider>
    )
}

export default App
