import React from "react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native"
import { useSharedContext } from "@meme-bros/shared"
import { Portal } from "react-native-paper"
import { useIsFocused } from "@react-navigation/native"
import { RootStackParamList } from "../../Navigator"
import Screen from "../styled/Screen"
import Canvas from "./Canvas"
import ActionBar from "./ActionBar"
import BaseSelector from "./BaseSelector"
import { Dimensions } from "../../lib/dimensions"

const ACTION_BAR_HEIGHT = 84

const useDimensions = Platform.select({
    web: () => Dimensions.get("window"),
    default: useWindowDimensions
})

function EditorScreen({
    navigation
}: NativeStackScreenProps<RootStackParamList, "Editor">) {
    const context = useSharedContext()
    
    const { height } = useDimensions()
    
    const isFocused = useIsFocused()
    
    return (
        <Screen>
            <Portal>
                <View
                    style={context.renderCanvas
                        ? {
                            width: "100%",
                            height: height - ACTION_BAR_HEIGHT
                        }
                        : { width: 0, height: 0 }
                    }
                >
                    <Canvas/>
                </View>
                {!isFocused ? null : context.renderCanvas ? (
                    <ActionBar/>
                ) : (
                    <View style={styles.center}>
                        <BaseSelector navigation={navigation}/>
                    </View>
                )}
            </Portal>
        </Screen>
    )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})

export default EditorScreen
