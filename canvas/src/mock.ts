import { ContextValue } from "./components/Context"
import { getDefaultDataByType } from "./components/elements"
import EventEmitter from "./lib/EventEmitter"
import { PickElement } from "./types"

export const contextValue: ContextValue = {
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
