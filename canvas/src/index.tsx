import "./style.css"
import React from "react"
import ReactDOM from "react-dom"
import { CssBaseline, GlobalStyles } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { BridgeProvider, SharedContextProvider } from "@meme-bros/client-lib"
import App from "./App"
import { AnimationRegistryProvider } from "./lib/animation"
import config from "./config"

const theme = createTheme({
    palette: {
        mode: "dark"
    }
})

if (config.debug) {
    console.log(theme)
}

const globalStyles = <GlobalStyles styles={{
    body: {
        overflow: "hidden"
    }
}}/>

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {globalStyles}
            <BridgeProvider>
                <SharedContextProvider>
                    <AnimationRegistryProvider>
                        <App/>
                    </AnimationRegistryProvider>
                </SharedContextProvider>
            </BridgeProvider>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
)
