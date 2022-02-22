import React, { useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { useNavigate } from "react-router-native"
import { Button, Surface } from "react-native-paper"
import { useSharedContext } from "@meme-bros/client-lib"
import Screen from "../styled/Screen"

function BaseSelectionScreen() {
    const context = useSharedContext()

    const navigate = useNavigate()

    useEffect(() => {
        if (context.renderCanvas) {
            navigate("/editor")
        }
    }, [context])

    return (
        <Screen>
            <View style={styles.center}>
                <Surface style={styles.container}>
                    <Button onPress={() => navigate("/templates")}>
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
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    container: {
        padding: 8
    }
})

export default BaseSelectionScreen
