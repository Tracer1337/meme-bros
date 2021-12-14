import { useState } from "react"
import { Box, styled } from "@mui/material"
import { deepmerge } from "@mui/utils"
import Canvas from "./components/editor/Canvas"
import { ContextValue, EditorContext } from "./components/editor/Context"
import { getDefaultDataByType } from "./components/editor/elements"
import EventEmitter from "./lib/EventEmitter"
import { PickElement } from "./types"

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

const Container = styled(Box)({
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "background.default"
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
        </EditorContext.Provider>
    )
}

export default App
