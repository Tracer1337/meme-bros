import "./style.css"
import React from "react"
import ReactDOM from "react-dom"
import { CssBaseline, GlobalStyles } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import App from "./components/App"
import { SnackbarProvider } from "./lib/snackbar"
import { DialogProvider } from "./lib/dialogs"

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
            <SnackbarProvider>
                <DialogProvider>
                    <App/>
                </DialogProvider>
            </SnackbarProvider>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
)
