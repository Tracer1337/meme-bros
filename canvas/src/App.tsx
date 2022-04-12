import { useEffect, useRef, useState } from "react"
import {
    Box,
    CssBaseline,
    styled,
    createTheme,
    ThemeProvider,
    GlobalStyles
} from "@mui/material"
import {
    SharedContext,
    useListeners,
    useSharedContext,
    useWindowMessaging
} from "@meme-bros/client-lib"
import { AnimationRegistryProvider } from "./lib/animation"
import Canvas from "./components/Canvas"
import { mockCanvas } from "./mock"
import DebugMenu from "./components/DebugMenu"
import config from "./config"

const theme = createTheme({
    palette: {
        mode: "dark"
    }
})

if (config.debug) {
    console.log(theme)
}

const globalStyles = <GlobalStyles styles={{
    body: {
        overflow: "hidden"
    }
}}/>

const MAX_HISTORY_LENGTH = 100

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
        if (history.length > MAX_HISTORY_LENGTH) {
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
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {globalStyles}
            <AnimationRegistryProvider>
                <Container>
                    {debug && <DebugMenu/>}
                    <CanvasContainer>
                        <Canvas/>
                    </CanvasContainer>
                </Container>
            </AnimationRegistryProvider>
        </ThemeProvider>
    )
}

export default App
