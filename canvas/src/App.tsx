import { useEffect, useRef, useState } from "react"
import { Box, styled } from "@mui/material"
import { SharedContext, useListeners, useSharedContext, useWindowMessaging } from "@meme-bros/client-lib"
import Canvas from "./components/Canvas"
import { mockCanvas } from "./mock"
import DebugMenu from "./components/DebugMenu"
import config from "./config"

const HISTORY_LENGTH = 100

const Container = styled(Box)({
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
})

const DebugContainer = styled(Box)({
    position: "absolute",
    top: "50%",
    left: 8,
    transform: "translateY(-50%)"
})

function App() {
    useWindowMessaging()

    const context = useSharedContext()

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
        <>
            <Container>
                <Canvas/>
            </Container>

            {debug && (
                <DebugContainer>
                    <DebugMenu/>
                </DebugContainer>
            )}
        </>
    )
}

export default App
