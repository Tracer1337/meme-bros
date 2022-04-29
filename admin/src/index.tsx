import "./style.css"
import React from "react"
import ReactDOM from "react-dom"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { CssBaseline, GlobalStyles } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { APIProvider } from "@meme-bros/api-sdk"
import { Storage } from "@lib/storage"
import { SnackbarProvider } from "@lib/snackbar"
import { DialogProvider } from "@lib/dialogs"
import { StoreProvider } from "@lib/store"
import Router from "@components/router/Router"

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

const queryClient = new QueryClient()

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {globalStyles}
            <QueryClientProvider client={queryClient}>
                <APIProvider config={{
                    host: process.env.ADMIN_API_HOST || "http://localhost:5000",
                    token: Storage.get(Storage.Keys.TOKEN) || ""
                }}>
                    <StoreProvider>
                        <SnackbarProvider>
                            <DialogProvider>
                                <Router/>
                            </DialogProvider>
                        </SnackbarProvider>
                    </StoreProvider>
                </APIProvider>
                <ReactQueryDevtools/>
            </QueryClientProvider>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
)
