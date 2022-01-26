import React from "react"
import { useSharedContext } from "@meme-bros/client-lib"
import { StyleSheet } from "react-native"
import { Button, Surface } from "react-native-paper"
import { NavigationProp } from "@react-navigation/native"
import { RootStackParamList } from "../../Navigator"

function BaseSelector({ navigation }: {
    navigation: NavigationProp<RootStackParamList>
}) {
    const context = useSharedContext()

    return (
        <Surface style={styles.container}>
            <Button onPress={() => navigation.navigate("Templates")}>
                Templates
            </Button>
            <Button onPress={() => context.events.emit("canvas.base.import")}>
                Import
            </Button>
            <Button onPress={() => context.events.emit("canvas.base.blank")}>
                Blank
            </Button>
            {__DEV__ && (
                <Button onPress={() => context.events.emit("canvas.base.dummy")}>
                    Load Dummy
                </Button>
            )}
        </Surface>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 8
    }
})

export default BaseSelector
