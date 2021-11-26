import React, { useContext, useEffect, useRef, useState } from "react"
import { Animated, GestureResponderEvent, StyleSheet, TextInput, View } from "react-native"
import { DialogContext } from "../../../lib/DialogHandler"
import { consumeEvent, setListeners } from "../../../lib/events"
import TextFitModule from "../../../lib/TextFitModule"
import { EditorContext } from "../Context"
import type { PickElement } from "./index"
import makeElement, { ElementProps } from "./makeElement"

function hasPressedElement(event: GestureResponderEvent, element: View) {
    // @ts-ignore
    return event.target._nativeTag === element._nativeTag
}

export type TextboxData = {
    text: string,
    fontFamily: string,
    color: string
}

export const textboxDefaultData: TextboxData = {
    text: "Enter Text...",
    fontFamily: "Impact",
    color: "#000000"
}

export function getTextStyles(element: PickElement<"textbox">) {
    return {
        fontFamily: element.data.fontFamily,
        color: element.data.color
    }
}

function Textbox({ element, setDraggableProps, size }: ElementProps & {
    element: PickElement<"textbox">
}) {
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
            text,
            fontFamily: element.data.fontFamily,
            fontWeight: "normal",
            containerRect: {
                width: x - 20,
                height: y - 20
            },
            low: 1,
            high: 1000
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
                context.canvas.focus === element.id ? styles.focus : {}
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
                    {text}
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
