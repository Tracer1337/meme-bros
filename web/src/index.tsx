import "./index.css"
import React from "react"
import ReactDOM from "react-dom"
import { BridgeProvider, SharedContextProvider } from "@meme-bros/shared"
import App from "@meme-bros/app"

ReactDOM.render(
    <React.StrictMode>
        <BridgeProvider>
            <SharedContextProvider>
                <div className="container">
                    <div className="app">
                        <App/>
                    </div>
                </div>
            </SharedContextProvider>
        </BridgeProvider>
    </React.StrictMode>,
    document.getElementById("root")
)
