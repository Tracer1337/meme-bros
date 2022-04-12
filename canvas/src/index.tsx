import "./style.css"
import React from "react"
import ReactDOM from "react-dom"
import { BridgeProvider, SharedContextProvider } from "@meme-bros/client-lib"
import App from "./App"

ReactDOM.render(
    <React.StrictMode>
        <BridgeProvider>
            <SharedContextProvider>
                <App/>
            </SharedContextProvider>
        </BridgeProvider>
    </React.StrictMode>,
    document.getElementById("root")
)
