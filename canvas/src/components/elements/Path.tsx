import { useContext } from "react"
import {
    updateElementData,
    useSharedContext,
    consumeEvent,
    useListeners
} from "@meme-bros/client-lib"
import { DialogContext } from "../../lib/DialogHandler"
import makeElement, { ElementProps } from "./makeElement"

function Path({ element }: ElementProps<"path">) {
    const context = useSharedContext()

    const dialogs = useContext(DialogContext)
    
    const handleConfig = async () => {
        // const data = await dialogs.open("", element)
        // context.events.emit("history.push")
        // context.set(updateElementData(context, element, data))
    }

    useListeners(context.events, [
        ["element.config", consumeEvent(element.id, handleConfig)]
    ])
    
    return (
        <div></div>
    )
}

export default makeElement(Path)
