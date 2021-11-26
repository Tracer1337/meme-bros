import React from "react"
import { Portal } from "react-native-paper"
import Navigator from "./Navigator"

function App() {
    return (
        <Portal.Host>
            <Navigator/>
        </Portal.Host>
    )
}

export default App
