import React from "react"
import { useSharedContext } from "@meme-bros/client-lib"
import { IconButton } from "react-native-paper"

function CommonElementActions() {
    const context = useSharedContext()

    const id = context.focus || 0

    return (
        <>
            <IconButton
                icon="delete-outline"
                onPress={() => context.events.emit("element.remove", id)}
            />
            <IconButton
                icon="flip-to-back"
                onPress={() => context.events.emit("element.layer", { id, layer: -1 })}
            />
            <IconButton
                icon="flip-to-front"
                onPress={() => context.events.emit("element.layer", { id, layer: 1 })}
            />
            <IconButton
                icon="content-copy"
                onPress={() => context.events.emit("element.copy", id)}
            />
        </>
    )
}

export default CommonElementActions
