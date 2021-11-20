import React, { useContext, useEffect, useRef, useState } from "react"
import { GestureResponderEvent, StyleSheet, TextInput, View } from "react-native"
import { setListeners } from "../../../lib/EventEmitter"
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
    fontSize: number
}

function Textbox({ element, setDraggableProps }: ElementProps & {
    element: PickElement<"textbox">
}) {
    const context = useContext(EditorContext)

    const containerRef = useRef<View>(null)
    const inputRef = useRef<TextInput>(null)
    
    const [text, setText] = useState(element.data.text)
    const [isTyping, setIsTyping] = useState(false)
    
    const handlePress = (event: GestureResponderEvent) => {
        if (!containerRef.current) {
            return
        }
        if (!hasPressedElement(event, containerRef.current)) {
            inputRef.current?.blur()
        }
    }

    useEffect(() =>
        setListeners(context.events, [["press", handlePress]])
    )

    useEffect(() => {
        setDraggableProps({ disabled: isTyping })
    }, [isTyping])

    return (
        <View  ref={containerRef} style={styles.container}>
            <TextInput
                style={[styles.input, {
                    fontFamily: element.data.fontFamily,
                    fontSize: element.data.fontSize
                }]}
                value={text}
                onChangeText={setText}
                multiline
                ref={inputRef}
                onFocus={() => setIsTyping(true)}
                onEndEditing={() => setIsTyping(false)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        borderColor: "#000",
        borderWidth: 1
    },

    input: {
        textAlignVertical: "top",
        padding: 0
    }
})

export default makeElement(Textbox)
