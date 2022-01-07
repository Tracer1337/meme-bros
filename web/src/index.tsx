import "./style.css"
import React from "react"
import ReactDOM from "react-dom"
import { CssBaseline, GlobalStyles } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import App from "./components/App"

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
            <App/>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
)
