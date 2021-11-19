import React, { useEffect, useState } from "react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { GestureResponderEvent, StyleSheet } from "react-native"
import deepmerge from "deepmerge"
import { isPlainObject } from "is-plain-object"
import { RootStackParamList } from "../../Navigator"
import Screen from "../styled/Screen"
import { contextDefaultValue, ContextValue, EditorContext } from "./Context"
import Canvas from "./Canvas"

function EditorScreen({}: NativeStackScreenProps<RootStackParamList, "Editor">) {
    const [contextValue, setContextValue] = useState<ContextValue>(contextDefaultValue)

    contextValue.set = (partial) => {
        const newState = deepmerge(contextValue, partial, {
            isMergeableObject: isPlainObject,
            arrayMerge: (_dest, source) => source
        }) as ContextValue
        setContextValue(newState)
    }
    
    const handleScreenPress = (event: GestureResponderEvent) => {
        contextValue.events.emit("press", event)
        return false
    }

    useEffect(() => {
        contextValue.set({
            canvas: {
                imageSource: require("../../assets/meme.png"),
                elements: [
                    {
                        id: 0,
                        type: "textbox",
                        rect: {
                            x: 100,
                            y: 100,
                            width: 200,
                            height: 100
                        },
                        data: {
                            text: "This is my text",
                            fontFamily: "impact",
                            fontSize: 32
                        }
                    }
                ]
            }
        })
    }, [])
    
    return (
        <Screen style={styles.container} onStartShouldSetResponder={handleScreenPress}>
            <EditorContext.Provider value={contextValue}>
                <Canvas/>
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