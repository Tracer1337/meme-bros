import React from "react"
import { StyleSheet } from "react-native"
import { Surface } from "react-native-paper"

function ItemBar() {
    return (
        <Surface style={styles.container}>

        </Surface>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 60
    },

    icon: {
        marginLeft: 12
    }
})

export default ItemBar
