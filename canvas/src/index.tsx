import "./style.css"
import React from "react"
import ReactDOM from "react-dom"
import Canvas from "./components/editor/Canvas"
import { ContextValue, EditorContext } from "./components/editor/Context"
import { getDefaultDataByType } from "./components/editor/elements"
import EventEmitter from "./lib/EventEmitter"
import { PickElement } from "./types"
import { CssBaseline, Box, styled } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"

const contextValue: ContextValue = {
    events: new EventEmitter(),
    interactions: {
        focus: null,
    },
    set: () => {},
    canvas: {
        width: 500,
        height: 500,
        debug: false,
        backgroundColor: "#444444",
        elements: [
            {
                id: 0,
                type: "textbox",
                rect: {
                    x: 100,
                    y: 200,
                    width: 200,
                    height: 100,
                    rotation: 0
                },
                data: {
                    ...getDefaultDataByType("textbox") as PickElement<"textbox">["data"],
                    text: "This is my text",
                    outlineWidth: 5,
                    outlineColor: "#000000",
                    color: "#ffffff",
                    backgroundColor: "transparent"
                }
            }
        ]
    }
}

const theme = createTheme({
    palette: {
        mode: "dark"
    }
})

console.log(theme)

const Container = styled(Box)({
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "background.default"
})

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <EditorContext.Provider value={contextValue}>
                <CssBaseline/>
                <Container>
                    <Box sx={{ border: "1px solid white" }}>
                        <Canvas/>
                    </Box>
                </Container>
            </EditorContext.Provider>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
)
