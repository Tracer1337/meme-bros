import React from "react"
import { IconButton, useTheme } from "react-native-paper"
import { AnyFunction } from "tsdef"
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"

export function useActions({ bottomSheetRef }: {
    bottomSheetRef: React.RefObject<BottomSheetMethods>
}) {
    const theme = useTheme()

    const action = (
        icon: string,
        fn: AnyFunction,
        props: Partial<React.ComponentProps<typeof IconButton>> = {}
    ) => React.createElement(IconButton, {
        color: theme.colors.onSurface,
        icon,
        onPress: () => {
            bottomSheetRef.current?.collapse()
            fn()
        },
        ...props
    })

    return { action }
}
