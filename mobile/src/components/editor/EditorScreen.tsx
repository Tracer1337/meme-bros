import React, { useEffect, useState } from "react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { GestureResponderEvent, StyleSheet } from "react-native"
import deepmerge from "deepmerge"
import { isPlainObject } from "is-plain-object"
import { RootStackParamList } from "../../Navigator"
import Screen from "../styled/Screen"
import { contextDefaultValue, ContextValue, EditorContext } from "./Context"
import Canvas from "./Canvas"
import BottomBar from "./BottomBar"
import { getDefaultDataByType } from "./elements"

function EditorScreen({}: NativeStackScreenProps<RootStackParamList, "Editor">) {
    const [context, setContext] = useState<ContextValue>(contextDefaultValue)

    context.set = (partial) => {
        const newState = deepmerge(context, partial, {
            isMergeableObject: isPlainObject,
            arrayMerge: (_dest, source) => source
        }) as ContextValue
        setContext(newState)
    }
    
    const handleScreenPress = (event: GestureResponderEvent) => {
        context.events.emit("screen.press", event)
        return false
    }

    useEffect(() => {
        context.set({
            canvas: {
                imageSource: require("../../assets/meme.png"),
                elements: [
                    {
                        id: -1,
                        type: "textbox",
                        rect: {
                            x: 100,
                            y: 100,
                            width: 200,
                            height: 100,
                            rotation: 0
                        },
                        data: {
                            ...getDefaultDataByType("textbox"),
                            text: "This is my text"
                        }
                    }
                ]
            }
        })
    }, [])
    
    return (
        <Screen style={styles.container} onStartShouldSetResponder={handleScreenPress}>
            <EditorContext.Provider value={context}>
                <Canvas/>
                <BottomBar/>
            </EditorContext.Provider>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})

export default EditorScreen
