import React, { useState } from "react"
import { FAB, Portal } from "react-native-paper"
import { useSharedContext } from "@meme-bros/client-lib"

function MoreActionsFAB() {
    const context = useSharedContext()
    
    const [open, setOpen] = useState(false)

    return (
        <Portal>
            <FAB.Group
                open={open}
                icon="dots-horizontal"
                onStateChange={({ open }: any) => setOpen(open)}
                actions={[
                    {
                        icon: "image",
                        label: "Import",
                        onPress: () => context.events.emit("canvas.base.import")
                    },
                    {
                        icon: "checkbox-blank-outline",
                        label: "Blank",
                        onPress: () => context.events.emit("canvas.base.blank")
                    },
                    ...(!__DEV__ ? [] : [
                        {
                            icon: "test-tube",
                            label: "Dummy",
                            onPress: () => context.events.emit("canvas.base.dummy")
                        }
                    ])
                ]}
            />
        </Portal>
    )
}

export default MoreActionsFAB
