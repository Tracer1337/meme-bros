import React from "react"
import { DarkTheme, Provider as PaperProvider } from "react-native-paper"
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
                <DialogProvider>
                    <SnackbarProvider>
                        <Router/>
                    </SnackbarProvider>
                </DialogProvider>
            </AppContextProvider>
        </PaperProvider>
    )
}

export default App
