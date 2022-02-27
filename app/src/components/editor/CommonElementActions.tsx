import React from "react"
import { useSharedContext } from "@meme-bros/client-lib"
import { useActions } from "./utils/actions"

function CommonElementActions({ action }: {
    action: ReturnType<typeof useActions>["action"]
}) {
    const context = useSharedContext()

    const id = context.focus || 0

    return (
        <>
            {action("delete-outline", () => context.events.emit("element.remove", id))}
            {action("flip-to-back", () => context.events.emit("element.layer", { id, layer: -1 }))}
            {action("flip-to-front", () => context.events.emit("element.layer", { id, layer: 1 }))}
            {action("content-copy", () => context.events.emit("element.copy", id))}
        </>
    )
}

export default CommonElementActions
