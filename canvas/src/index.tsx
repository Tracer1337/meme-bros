import "./style.css"
import React from "react"
import ReactDOM from "react-dom"
import { CssBaseline } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import App from "./App"

const theme = createTheme({
    palette: {
        mode: "dark"
    }
})

console.log(theme)

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <App/>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
)
