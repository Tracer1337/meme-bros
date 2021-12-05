import React, { useEffect, useState } from "react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { GestureResponderEvent, Image, StyleSheet } from "react-native"
import deepmerge from "deepmerge"
import { isPlainObject } from "is-plain-object"
import { RootStackParamList } from "../../Navigator"
import Screen from "../styled/Screen"
import { contextDefaultValue, ContextValue, EditorContext } from "./Context"
import Canvas from "./Canvas"
import BottomBar from "./BottomBar"
import { getDefaultDataByType } from "./elements"
import { fetchBase64 } from "../../lib/base64"
import { Canvas as CanvasType, PickElement } from "../../types"

function binaryToPNG(base64: string) {
    return base64.replace("application/octet-stream", "image/png")
}

async function loadCanvasDummy(): Promise<CanvasType> {
    const image = Image.resolveAssetSource(require("../../assets/meme.png"))
    return {
        width: image.width,
        height: image.height,
        debug: false,
        backgroundColor: [255, 255, 255, 255],
        elements: [
            {
                id: -2,
                type: "image",
                rect: {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                    rotation: 0
                },
                data: {
                    uri: binaryToPNG(await fetchBase64(image.uri)),
                    borderRadius: 0
                }
            },
            {
                id: -1,
                type: "textbox",
                rect: {
                    x: 100,
                    y: 200,
                    width: 200,
                    height: 100,
                    rotation: 0
                },
                data: {
                    ...getDefaultDataByType("textbox") as PickElement<"textbox">["data"],
                    text: "This is my text"
                }
            }
        ]
    }
}

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
        loadCanvasDummy().then((canvas) => context.set({ canvas }))
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
