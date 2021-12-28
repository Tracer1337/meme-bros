import React from "react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StyleSheet, View } from "react-native"
import { useSharedContext } from "@meme-bros/shared"
import { RootStackParamList } from "../../Navigator"
import Screen from "../styled/Screen"
import Canvas from "./Canvas"
import ActionBar from "./ActionBar"
import BaseSelector from "./BaseSelector"

function EditorScreen({}: NativeStackScreenProps<RootStackParamList, "Editor">) {
    const context = useSharedContext()
    
    return (
        <Screen style={styles.container}>
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
