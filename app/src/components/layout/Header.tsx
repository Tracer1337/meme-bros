import React from "react"
import { StyleSheet, View } from "react-native"
import { ActivityIndicator, IconButton, Surface, Text } from "react-native-paper"
import { useAppContext } from "../../lib/context"

function Header() {
    const appContext = useAppContext()

    return (
        <Surface style={styles.header}>
            <View style={styles.left}>
                <IconButton
                    icon="menu"
                    style={styles.menuButton}
                    onPress={() => console.log("Menu")}
                />
                <Text>MEME BROS</Text>
            </View>
            <View>
                {appContext.sync.isLoading && (
                    <ActivityIndicator animating/>
                )}
                {appContext.sync.error && (
                    <Text>Sync Failed</Text>
                )}
            </View>
        </Surface>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    left: {
        flexDirection: "row",
        alignItems: "center"
    },

    menuButton: {
        marginLeft: 0,
        marginRight: 12
    }
})

export default Header
