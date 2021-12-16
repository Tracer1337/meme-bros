import { useState } from "react"
import { Box, styled } from "@mui/material"
import { deepmerge } from "@mui/utils"
import Canvas from "./components/editor/Canvas"
import { ContextValue, EditorContext } from "./components/editor/Context"
import { contextValue } from "./mock"
import DebugMenu from "./components/editor/DebugMenu"

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

    context.set = (partial) => {
        const newState = deepmerge(context, partial) as ContextValue
        setContext(newState)
    }

    return (
        <EditorContext.Provider value={context}>
            <Container>
                <Canvas/>
            </Container>

            <DebugContainer>
                <DebugMenu/>
            </DebugContainer>
        </EditorContext.Provider>
    )
}

export default App
