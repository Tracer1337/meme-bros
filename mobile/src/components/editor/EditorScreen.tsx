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
import { setListeners } from "../../lib/events"
import { ElementTypes, getDefaultDataByType, PickElement } from "./elements"
import useId from "../../lib/useId"

function EditorScreen({}: NativeStackScreenProps<RootStackParamList, "Editor">) {
    const getId = useId()
    
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

    const handleCreateElement = <T extends ElementTypes>(type: T) => {
        const newElement: PickElement<T> = {
            id: getId(),
            type,
            rect: {
                x: 0,
                y: 0,
                width: 200,
                height: 100,
                rotation: 0
            },
            data: getDefaultDataByType(type)
        }
        context.set({
            canvas: {
                elements: [...context.canvas.elements, newElement]
            }
        })
    }

    useEffect(() => {
        context.set({
            canvas: {
                imageSource: require("../../assets/meme.png"),
                elements: [
                    {
                        id: getId(),
                        type: "textbox",
                        rect: {
                            x: 100,
                            y: 100,
                            width: 200,
                            height: 100,
                            rotation: 0
                        },
                        data: {
                            text: "This is my text",
                            fontFamily: "impact",
                            color: "#000000"
                        }
                    }
                ]
            }
        })
    }, [])

    useEffect(() =>
        setListeners(context.events, [
            ["element.create", handleCreateElement]
        ])
    )
    
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
