import { useRef } from "react"
import {
    Modules,
    useRNWebViewMessaging,
    useSharedContext
} from "@meme-bros/client-lib"
import WebView from "react-native-webview"

const uri = __DEV__
    ? "http://10.0.2.2:3000"
    : "file:///android_asset/canvas/build/index.html"

function CanvasComponent() {
    const context = useSharedContext()
    
    const ref = useRef<WebView>(null)

    const { onMessage } = useRNWebViewMessaging(ref)
    
    // @ts-ignore
    return React.createElement(WebView, {
        source: { uri },
        ref,
        onMessage,
        onLoad: () => context.events.emit("canvas.load"),
        bounces: false,
        scollEnabled: false,
        allowFileAccess: true
    })
}

export function useCanvasModule(): Modules.CanvasModule {
    return {
        CanvasComponent
    }
}
