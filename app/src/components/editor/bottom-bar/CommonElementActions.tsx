import React from "react"
import { IconButton, useTheme } from "react-native-paper"
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import { useSharedContext } from "@meme-bros/client-lib"
import { useCallbacks } from "./utils/callbacks"

function CommonElementActions({ bottomSheet }: {
    bottomSheet: React.RefObject<BottomSheetMethods>
}) {
    const context = useSharedContext()

    const theme = useTheme()
    
    const callback = useCallbacks(bottomSheet)
    
    const id = context.focus || 0

    return (
        <>
            <IconButton
                color={theme.colors.onSurface}
                icon="delete-outline"
                onPress={callback(() => context.events.emit("element.remove", id))}
            />
            <IconButton
                color={theme.colors.onSurface}
                icon="flip-to-back"
                onPress={callback(() => context.events.emit("element.layer", { id, layer: -1 }))}
            />
            <IconButton
                color={theme.colors.onSurface}
                icon="flip-to-front"
                onPress={callback(() => context.events.emit("element.layer", { id, layer: 1 }))}
            />
            <IconButton
                color={theme.colors.onSurface}
                icon="content-copy"
                onPress={callback(() => context.events.emit("element.copy", id))}
            />
        </>
    )
}

export default CommonElementActions
