import React from "react"
import { DarkTheme, Provider as PaperProvider, Portal } from "react-native-paper"
import Navigator from "./Navigator"
import ResourceLoader from "./ResourceLoader"
import { DialogProvider } from "./lib/DialogHandler"
import { AppContextProvider } from "./lib/context"
import { SnackbarProvider } from "./lib/snackbar"

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
