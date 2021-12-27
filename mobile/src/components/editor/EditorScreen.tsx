import React, { useState } from "react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StyleSheet, View } from "react-native"
import deepmerge from "deepmerge"
import { isPlainObject } from "is-plain-object"
import { RootStackParamList } from "../../Navigator"
import Screen from "../styled/Screen"
import { contextDefaultValue, ContextValue, EditorContext } from "./Context"
import Canvas from "./Canvas"
import ActionBar from "./ActionBar"
import BaseSelector from "./BaseSelector"

function EditorScreen({}: NativeStackScreenProps<RootStackParamList, "Editor">) {
    const [context, setContext] = useState<ContextValue>(contextDefaultValue)

    context.set = (partial) => {
        const newState = deepmerge(context, partial, {
            isMergeableObject: isPlainObject,
            arrayMerge: (_dest, source) => source
        }) as ContextValue
        setContext(newState)
    }

    return (
        <Screen style={styles.container}>
            <EditorContext.Provider value={context}>
                <View
                    style={context.renderCanvas
                        ? { width: "100%", height: "100%" }
                        : { width: 0, height: 0 }
                    }
                >
                    <Canvas/>
                </View>
                {context.renderCanvas ? (
                    <ActionBar/>
                ) : (
                    <View style={styles.center}>
                        <BaseSelector/>
                    </View>
                )}
            </EditorContext.Provider>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%"
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})

export default EditorScreen
