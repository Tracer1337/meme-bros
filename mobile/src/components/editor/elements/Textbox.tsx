import React, { useContext, useEffect, useRef, useState } from "react"
import { GestureResponderEvent, StyleSheet, TextInput, View } from "react-native"
import Draggable from "react-native-draggable"
import { setListeners } from "../../../lib/EventEmitter"
import { EditorContext } from "../Context"

function pressedElement(event: GestureResponderEvent, element: View) {
    // @ts-ignore
    return event.target._nativeTag === element._nativeTag
}

export type TextboxData = {
    x: number,
    y: number,
    width: number,
    height: number,
    text: string
}

function Textbox({ data }: { data: TextboxData }) {
    const context = useContext(EditorContext)

    const containerRef = useRef<View>(null)
    const inputRef = useRef<TextInput>(null)
    
    const [text, setText] = useState(data.text)
    const [isTyping, setIsTyping] = useState(false)
    
    const handlePress = (event: GestureResponderEvent) => {
        if (!containerRef.current) {
            return
        }
        if (!pressedElement(event, containerRef.current)) {
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
            x={data.x}
            y={data.y}
            minX={0}
            minY={0}
            maxX={context.dimensions.width}
            maxY={context.dimensions.height}
            touchableOpacityProps={{ activeOpacity: 1 }}
            disabled={isTyping}
        >
            <View ref={containerRef}>
                <View style={styles.container}>
                    <TextInput
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
        borderColor: "#000",
        borderWidth: 1,
        paddingHorizontal: 8
    }
})

export default Textbox
