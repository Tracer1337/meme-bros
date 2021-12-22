import { ContextValue } from "./components/Context"
import { getDefaultDataByType } from "./components/elements"
import EventEmitter from "./lib/EventEmitter"
import { PickElement } from "./types"

export const mockContextValue: ContextValue = {
    events: new EventEmitter(),
    interactions: {
        focus: null,
    },
    set: () => mockContextValue,
    push: () => {},
    pop: () => {},
    canvas: {
        domRect: null,
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
                    outlineWidth: 2,
                    outlineColor: "#000000",
                    color: "#ffffff"
                }
            }
        ]
    }
}
