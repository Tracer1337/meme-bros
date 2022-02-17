import { useEffect, useRef, useState } from "react"
import { Box, styled } from "@mui/material"
import {
    SharedContext,
    useListeners,
    useSharedContext,
    useWindowMessaging
} from "@meme-bros/client-lib"
import Canvas from "./components/Canvas"
import { mockCanvas } from "./mock"
import DebugMenu from "./components/DebugMenu"
import config from "./config"

const HISTORY_LENGTH = 100

const Container = styled(Box)({
    height: "100vh",
    display: "flex"
})

const CanvasContainer = styled(Box)({
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
})

function App() {
    useWindowMessaging()

    const context = useSharedContext()

    console.log(context)

    const history = useRef<SharedContext.ContextValue["canvas"][]>([]).current
    const [debug, setDebug] = useState(false)

    const handleHistoryPush = () => {
        history.push(context.canvas)
        if (history.length > HISTORY_LENGTH) {
            history.shift()
        }
    }

    const handleHistoryPop = () => {
        const newState = history.pop()
        if (!newState) {
            return
        }
        context.set({ canvas: newState })
    }

    useListeners(context.events, [
        ["history.push", handleHistoryPush],
        ["history.pop", handleHistoryPop]
    ])

    useEffect(() => {
        if (config.debug) {
            requestAnimationFrame(() =>
                context.set({ canvas: mockCanvas })
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    // @ts-ignore
    window.enableDebugging = () => {
        setDebug(true)
    }

    return (
        <Container>
            {debug && <DebugMenu/>}
            <CanvasContainer>
                <Canvas/>
            </CanvasContainer>
        </Container>
    )
}

export default App
