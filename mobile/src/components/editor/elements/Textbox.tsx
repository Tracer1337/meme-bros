import React, { useContext, useEffect, useRef, useState } from "react"
import { GestureResponderEvent, StyleSheet, TextInput, View } from "react-native"
import Draggable from "react-native-draggable"
import { setListeners } from "../../../lib/EventEmitter"
import { EditorContext } from "../Context"
import type { PickElement } from "./index"
import makeElement from "./makeElement"

function hasPressedElement(event: GestureResponderEvent, element: View) {
    // @ts-ignore
    return event.target._nativeTag === element._nativeTag
}

export type TextboxData = {
    text: string,
    fontFamily: "Arial" | "impact",
    fontSize: number
}

function Textbox({ element }: { element: PickElement<"textbox"> }) {
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
        setListeners(context.events, [
            ["press", handlePress]
        ])
    )

    return (
        <Draggable
            x={element.rect.x}
            y={element.rect.y}
            minX={0}
            minY={0}
            maxX={context.dimensions.width}
            maxY={context.dimensions.height}
            touchableOpacityProps={{ activeOpacity: 1 }}
            disabled={isTyping}
        >
            <View
                ref={containerRef}
                style={{
                    width: element.rect.width,
                    height: element.rect.height
                }}
            >
                <View style={styles.container}>
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
            </View>
        </Draggable>
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
