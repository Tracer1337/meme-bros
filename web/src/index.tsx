import "./style.css"
import React from "react"
import ReactDOM from "react-dom"
import { AdminAPIProvider } from "@meme-bros/api-sdk/dist/admin"
import { PublicAPIProvider } from "@meme-bros/api-sdk"
import { Storage } from "./lib/storage"
import RNApp from "./components/RNApp"
import { BridgeProvider, SharedContextProvider } from "@meme-bros/client-lib"

ReactDOM.render(
    <React.StrictMode>
        <PublicAPIProvider config={{
            host: process.env.PUBLIC_API_HOST || "http://localhost:6006"
        }}>
            <AdminAPIProvider config={{
                host: process.env.ADMIN_API_HOST || "http://localhost:5000",
                token: Storage.get(Storage.Keys.TOKEN) || ""
            }}>
                <BridgeProvider>
                    <SharedContextProvider>
                        <RNApp
                            width={window.innerWidth}
                            height={window.innerHeight}
                        />
                    </SharedContextProvider>
                </BridgeProvider>
            </AdminAPIProvider>
        </PublicAPIProvider>
    </React.StrictMode>,
    document.getElementById("root")
)
