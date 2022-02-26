import React from "react"
import {
    copyElement,
    layerElement,
    removeElement,
    useSharedContext
} from "@meme-bros/client-lib"
import { useActions } from "./utils/actions"

function CommonElementActions({ action }: {
    action: ReturnType<typeof useActions>["action"]
}) {
    const context = useSharedContext()

    const id = context.focus || 0

    return (
        <>
            {action("delete-outline", () => context.set(removeElement(context, id)))}
            {action("flip-to-back", () => context.set(layerElement(context, id, -1)))}
            {action("flip-to-front", () => context.set(layerElement(context, id, 1)))}
            {action("content-copy", () => context.set(copyElement(context, id)))}
        </>
    )
}

export default CommonElementActions
