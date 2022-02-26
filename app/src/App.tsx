import React from "react"
import { LogBox } from "react-native"
import { DarkTheme, Portal, Provider as PaperProvider } from "react-native-paper"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { DialogProvider } from "./lib/DialogHandler"
import Router from "./components/router/Router"
import { AppContextProvider } from "./lib/context"
import { SnackbarProvider } from "./lib/snackbar"
import { useResources } from "./lib/resources"

LogBox.ignoreAllLogs()

function ResourceLoader() {
    useResources()
    return null
}

function App() {
    return (
        <PaperProvider theme={DarkTheme}>
            <AppContextProvider>
                <ResourceLoader/>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <Portal.Host>
                        <DialogProvider>
                            <SnackbarProvider>
                                    <Router/>
                            </SnackbarProvider>
                        </DialogProvider>
                    </Portal.Host>
                </GestureHandlerRootView>
            </AppContextProvider>
        </PaperProvider>
    )
}

export default App
