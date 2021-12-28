import * as Core from "@meme-bros/core"
import { SharedContext } from "@meme-bros/shared"
import { getDefaultDataByType } from "./components/elements"
import EventEmitter from "./lib/EventEmitter"

export const mockContextValue: SharedContext.ContextValue = {
    events: new EventEmitter(),
    interactions: {
        focus: null,
    },
    set: () => mockContextValue,
    push: () => {},
    pop: () => {},
    canvasDomRect: null,
    canvas: {
        width: 500,
        height: 500,
        pixelRatio: 1,
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
                    ...getDefaultDataByType("textbox") as Core.PickElement<"textbox">["data"],
                    outlineWidth: 2,
                    outlineColor: "#000000",
                    color: "#ffffff"
                }
            }
        ]
    }
}
