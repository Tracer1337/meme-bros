import React from "react"
import ReactDOM from "react-dom"
import { APIProvider } from "@meme-bros/api-sdk"
import { BridgeProvider, SharedContextProvider } from "@meme-bros/client-lib"
import App from "./App"

ReactDOM.render(
    <React.StrictMode>
        <APIProvider config={{
            host: process.env.ADMIN_API_HOST || "http://localhost:5000"
        }}>
            <BridgeProvider>
                <SharedContextProvider>
                    <App
                        width={window.innerWidth}
                        height={window.innerHeight}
                    />
                </SharedContextProvider>
            </BridgeProvider>
        </APIProvider>
    </React.StrictMode>,
    document.getElementById("root")
)
