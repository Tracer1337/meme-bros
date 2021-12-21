import { useRef, useState } from "react"
import { Box, styled } from "@mui/material"
import { deepmerge } from "@mui/utils"
import Canvas from "./components/Canvas"
import { ContextValue, CanvasContext, defaultContextValue } from "./components/Context"
import { mockContextValue } from "./mock"
import DebugMenu from "./components/DebugMenu"

const contextValue = process.env.NODE_ENV === "development"
    ? mockContextValue
    : defaultContextValue

const Container = styled(Box)({
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "background.default"
})

const DebugContainer = styled(Box)({
    position: "absolute",
    top: "50%",
    left: 8,
    transform: "translateY(-50%)"
})

function App() {
    const [context, setContext] = useState<ContextValue>(contextValue)
    const [debug, setDebug] = useState(false)

    context.set = (partial) => {
        const newState = deepmerge(context, partial) as ContextValue
        setContext(newState)
    }

    // @ts-ignore
    window.enableDebugging = () => {
        setDebug(true)
    }

    return (
        <CanvasContext.Provider value={context}>
            <Container>
                <Canvas/>
            </Container>

            {debug && (
                <DebugContainer>
                    <DebugMenu/>
                </DebugContainer>
            )}
        </CanvasContext.Provider>
    )
}

export default App
