import React, { useEffect, useRef } from "react"
import WebView from "react-native-webview"

function Canvas() {
    const canvas = useRef<WebView>(null)

    useEffect(() => {
        if (!canvas.current) {
            return
        }
        console.log(canvas.current)
    }, [])

    return (
        <WebView
            originWhitelist={["*"]}
            source={{ uri: "http://10.0.2.2:3000" }}
            ref={canvas}
            onLayout={e => {
                e.persist()
                console.log(e.nativeEvent.layout)
            }}
        />
    )
}

export default Canvas
