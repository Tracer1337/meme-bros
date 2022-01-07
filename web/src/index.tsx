import "./index.css"
import React from "react"
import ReactDOM from "react-dom"
import { CssBaseline } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { BridgeProvider, SharedContextProvider } from "@meme-bros/shared"
import App from "@meme-bros/app"

const theme = createTheme({
    palette: {
        mode: "dark"
    }
})

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <BridgeProvider>
                <SharedContextProvider>
                    <div className="container">
                        <div id="app">
                            <App/>
                        </div>
                    </div>
                </SharedContextProvider>
            </BridgeProvider>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
)
