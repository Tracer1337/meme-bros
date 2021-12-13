import React from "react"
import ReactDOM from "react-dom"
import Canvas from "./components/editor/Canvas"
import { EditorContext } from "./components/editor/Context"
import { getDefaultDataByType } from "./components/editor/elements"
import EventEmitter from "./lib/EventEmitter"
import { PickElement } from "./types"

ReactDOM.render(
    <React.StrictMode>
        <EditorContext.Provider value={{
            events: new EventEmitter(),
            interactions: {
                focus: null,
            },
            set: () => {},
            canvas: {
                width: 100,
                height: 100,
                debug: false,
                backgroundColor: "#ffffff",
                elements: [
                    {
                        id: 0,
                        type: "textbox",
                        rect: {
                            x: 50,
                            y: 50,
                            width: 200,
                            height: 100,
                            rotation: 0
                        },
                        data: {
                            ...getDefaultDataByType("textbox") as PickElement<"textbox">["data"],
                            text: "This is my text",
                            outlineWidth: 5,
                            outlineColor: "#ffffff",
                            backgroundColor: "#2ecc71"
                        }
                    }
                ]
            }
        }}>
            <Canvas/>
        </EditorContext.Provider>
    </React.StrictMode>,
    document.getElementById("root")
)
