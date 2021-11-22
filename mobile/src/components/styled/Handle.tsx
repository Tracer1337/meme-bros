import React from "react"
import { StyleSheet } from "react-native"
import Draggable from "../../lib/Draggable"

function Handle({ children, style, ...props }: React.ComponentProps<typeof Draggable>) {
    return (
        <Draggable style={[styles.handle, style]} {...props}>
            {children}
        </Draggable>
    )
}
const styles = StyleSheet.create({
    handle: {
        backgroundColor: "#fff",
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 4
    }
})

export default Handle
