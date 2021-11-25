import React, { useContext, useEffect, useRef, useState } from "react"
import { Animated, GestureResponderEvent, StyleSheet, TextInput, View } from "react-native"
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
    fontFamily: "Arial" | "impact",
    color: "#000000"
}

export const textboxDefaultData: TextboxData = {
    text: "Enter Text...",
    fontFamily: "impact",
    color: "#000000"
}

function Textbox({ element, setDraggableProps, size }: ElementProps & {
    element: PickElement<"textbox">
}) {
    const context = useContext(EditorContext)

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
        ])
    )

    useEffect(() => {
        const id = size.addListener(handleResize)
        return () => size.removeListener(id)
    }, [size])

    useEffect(() => {
        setDraggableProps({ disabled: isEditing })
    }, [isEditing])

    const textStyles = {
        fontFamily: element.data.fontFamily,
        color: element.data.color
    }

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
