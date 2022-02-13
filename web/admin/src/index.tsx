import "./style.css"
import React from "react"
import ReactDOM from "react-dom"
import { CssBaseline, GlobalStyles } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { AdminAPIProvider } from "@meme-bros/api-sdk/dist/admin"
import { PublicAPIProvider } from "@meme-bros/api-sdk"
import App from "./components/App"
import { Storage } from "./lib/storage"
import { SnackbarProvider } from "./lib/snackbar"
import { DialogProvider } from "./lib/dialogs"
import { StoreProvider } from "./lib/store"

const globalStyles = <GlobalStyles styles={{
    a: {
        textDecoration: "none"
    }
}}/>

const theme = createTheme({
    palette: {
        mode: "dark"
    }
})

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {globalStyles}
            <PublicAPIProvider config={{
                host: process.env.PUBLIC_API_HOST || "http://localhost:6006"
            }}>
                <AdminAPIProvider config={{
                    host: process.env.ADMIN_API_HOST || "http://localhost:5000",
                    token: Storage.get(Storage.Keys.TOKEN) || ""
                }}>
                    <StoreProvider>
                        <SnackbarProvider>
                            <DialogProvider>
                                <App/>
                            </DialogProvider>
                        </SnackbarProvider>
                    </StoreProvider>
                </AdminAPIProvider>
            </PublicAPIProvider>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
)
