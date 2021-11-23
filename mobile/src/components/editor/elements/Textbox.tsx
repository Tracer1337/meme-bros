import React, { useContext, useEffect, useRef, useState } from "react"
import { GestureResponderEvent, StyleSheet, Text, TextInput, View } from "react-native"
import { consumeEvent, setListeners } from "../../../lib/events"
import { EditorContext } from "../Context"
import type { PickElement } from "./index"
import makeElement, { ElementProps } from "./makeElement"

function hasPressedElement(event: GestureResponderEvent, element: View) {
    // @ts-ignore
    return event.target._nativeTag === element._nativeTag
}

export type TextboxData = {
    text: string,
    fontFamily: "Arial" | "impact",
    color: "#000000"
}

export const textboxDefaultData: TextboxData = {
    text: "Enter Text...",
    fontFamily: "impact",
    color: "#000000"
}

function Textbox({ element, setDraggableProps }: ElementProps & {
    element: PickElement<"textbox">
}) {
    const context = useContext(EditorContext)

    const containerRef = useRef<View>(null)
    
    const [text, setText] = useState(element.data.text)
    const [isEditing, setIsEditing] = useState(false)
    
    const handlePress = (event: GestureResponderEvent) => {
        if (!containerRef.current) {
            return
        }
        if (!hasPressedElement(event, containerRef.current)) {
            setIsEditing(false)
        }
    }

    const handleEdit = () => {
        setIsEditing(true)
    }

    useEffect(() =>
        setListeners(context.events, [
            ["screen.press", handlePress],
            ["element.edit", consumeEvent(element.id, handleEdit)],
        ])
    )

    useEffect(() => {
        setDraggableProps({ disabled: isEditing })
    }, [isEditing])

    const textStyles = {
        fontFamily: element.data.fontFamily,
        color: element.data.color
    }

    return (
        <View ref={containerRef} style={styles.container}>
            {isEditing ? (
                <TextInput
                    style={[styles.input, textStyles]}
                    value={text}
                    onChangeText={setText}
                    multiline
                    autoFocus
                />
            ) : (
                <Text style={[textStyles, { fontSize: 24 }]}>{text}</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        borderColor: "#000",
        borderWidth: 1,
        borderStyle: "dashed",
        // Without border-radius the border-style doesn't work
        borderRadius: .1
    },

    input: {
        textAlignVertical: "top",
        padding: 0,
        fontSize: 24
    }
})

export default makeElement(Textbox)
