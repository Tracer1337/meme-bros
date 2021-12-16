import "./style.css"
import React from "react"
import ReactDOM from "react-dom"
import { CssBaseline } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import App from "./App"
import { DialogProvider } from "./lib/DialogHandler"

const theme = createTheme({
    palette: {
        mode: "dark"
    }
})

if (process.env.NODE_ENV === "development") {
    console.log(theme)
}

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <DialogProvider>
                <App/>
            </DialogProvider>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
)
