import "./style.css"
import React from "react"
import ReactDOM from "react-dom"
import { BridgeProvider, SharedContextProvider } from "@meme-bros/client-lib"
import App from "./App"
import { GlobalStyles } from "@mui/material"

const globalStyles = <GlobalStyles styles={{
    "#root": {
        height: "100vh",
        display: "flex"
    }
}}/>

ReactDOM.render(
    <React.StrictMode>
        <BridgeProvider>
            <SharedContextProvider>
                <App/>
                {globalStyles}
            </SharedContextProvider>
        </BridgeProvider>
    </React.StrictMode>,
    document.getElementById("root")
)
