import React from "react"
import { StyleSheet } from "react-native"
import { IconButton, Surface, Text } from "react-native-paper"

function Header() {
    return (
        <Surface style={styles.header}>
            <IconButton
                icon="menu"
                style={styles.menuButton}
                onPress={() => console.log("Menu")}
            />
            <Text>MEME BROS</Text>
        </Surface>
    )
}

const styles = StyleSheet.create({
    header: {
        padding: 8,
        marginHorizontal: 16,
        marginVertical: 32,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center"
    },

    menuButton: {
        marginRight: 16
    }
})

export default Header
