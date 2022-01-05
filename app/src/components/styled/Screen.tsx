import React from "react"
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from "react-native"
import { useTheme } from "react-native-paper"

function Screen({ children, style, ...props }: React.PropsWithChildren<{
    style?: StyleProp<ViewStyle>
} & ViewProps>) {
    const theme = useTheme()

    return (
        <View
            style={StyleSheet.flatten([
                {
                    backgroundColor: theme.colors.background,
                    width: "100%",
                    height: "100%"
                },
                style
            ])}
            {...props}
        >
            { children }
        </View>
    )
}

export default Screen
