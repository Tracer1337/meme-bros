import React, { useContext, useEffect, useRef, useState } from "react"
import { Animated, GestureResponderEvent, StyleSheet, TextInput, View } from "react-native"
import { DialogContext } from "../../../lib/DialogHandler"
import { consumeEvent, setListeners } from "../../../lib/events"
import TextFitModule from "../../../lib/TextFitModule"
import { PickElement } from "../../../types"
import { EditorContext } from "../Context"
import makeElement, { ElementProps } from "./makeElement"

function hasPressedElement(event: GestureResponderEvent, element: View) {
    // @ts-ignore
    return event.target._nativeTag === element._nativeTag
}

export const textboxDefaultData: PickElement<"textbox">["data"] = {
    text: "Enter Text...",
    fontFamily: "Impact",
    fontWeight: "normal",
    textAlign: "left",
    color: "#000000",
    caps: true,
    outlineWidth: 0,
    outlineColor: "#ffffff",
    backgroundColor: "transparent"
}

export function getTextStyles(element: PickElement<"textbox">) {
    return {
        fontFamily: `${element.data.fontFamily}_${element.data.fontWeight}`,
        color: element.data.color
    }
}

export function getTransformedText(element: PickElement<"textbox">) {
    return element.data.caps
        ? element.data.text.toUpperCase()
        : element.data.text
}

function Textbox({ element, setDraggableProps, size }: ElementProps<"textbox">) {
    const context = useContext(EditorContext)
    const dialogs = useContext(DialogContext)

    const containerRef = useRef<View>(null)
    const fontSize = useRef(new Animated.Value(32)).current
    
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

    const handleConfig = async () => {
        element.data = await dialogs.openDialog("TextboxConfigDialog", element)
        context.set({})
    }

    const handleResize = async ({ x, y }: { x: number, y: number }) => {
        const newFontSize = await TextFitModule.fitText({
            text: getTransformedText(element),
            fontFamily: element.data.fontFamily,
            fontWeight: "normal",
            containerRect: { width: x, height: y }
        })
        fontSize.setValue(newFontSize)
    }

    useEffect(() =>
        setListeners(context.events, [
            ["screen.press", handlePress],
            ["element.edit", consumeEvent(element.id, handleEdit)],
            ["element.config", consumeEvent(element.id, handleConfig)]
        ])
    )

    useEffect(() => {
        const id = size.addListener(handleResize)
        return () => size.removeListener(id)
    }, [size])

    useEffect(() => {
        setDraggableProps({ disabled: isEditing })
    }, [isEditing])

    useEffect(() => {
        element.data.text = text
    }, [text])

    const textStyles = getTextStyles(element)

    return (
        <View
            ref={containerRef}
            style={[
                styles.container,
                context.interactions.focus === element.id ? styles.focus : {}
            ]}
        >
            {isEditing ? (
                <TextInput
                    style={[styles.input, textStyles]}
                    value={text}
                    onChangeText={setText}
                    multiline
                    autoFocus
                />
            ) : (
                <Animated.Text style={[textStyles, { fontSize }]}>
                    {getTransformedText(element)}
                </Animated.Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%"
    },

    focus: {
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
