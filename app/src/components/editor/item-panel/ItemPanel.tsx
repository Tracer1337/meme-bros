import { StyleSheet } from "react-native"
import { useNavigate } from "react-router-native"
import { Divider, IconButton, Surface, useTheme } from "react-native-paper"
import {
    clearCanvas,
    enableDrawing,
    useModule,
    useSharedContext
} from "@meme-bros/client-lib"
import { useCanvasActions } from "../utils/actions"

function ItemPanel() {
    const context = useSharedContext()

    const theme = useTheme()
    
    const core = useModule("core")

    const navigate = useNavigate()
    
    const {
        createElement,
        render,
        isRendering
    } = useCanvasActions()

    return (
        <Surface style={styles.container}>
            <IconButton
                style={styles.icon}
                color={theme.colors.onSurface}
                icon="format-color-text"
                onPress={() => createElement("textbox")}
            />
            <IconButton
                style={styles.icon}
                color={theme.colors.onSurface}
                icon="image"
                onPress={() => createElement("image")}
            />
            <IconButton
                style={styles.icon}
                color={theme.colors.onSurface}
                icon="shape"
                onPress={() => createElement("shape")}
            />
            <IconButton
                style={styles.icon}
                color={theme.colors.onSurface}
                icon="lead-pencil"
                onPress={() => context.set(enableDrawing())}
            />
            <IconButton
                style={styles.icon}
                color={theme.colors.onSurface}
                icon="sticker"
                onPress={() => context.events.emit("stickers.open")}
            />
            <Divider style={styles.divider}/>
            <IconButton
                style={styles.icon}
                color={theme.colors.accent}
                icon="check"
                onPress={render}
                isLoading={isRendering}
                disabled={!core?.render}
            />
            <IconButton
                style={styles.icon}
                color={theme.colors.onSurface}
                icon="undo"
                onPress={() => context.events.emit("history.pop")} 
            />
            <IconButton
                style={styles.icon}
                color={theme.colors.onSurface}
                icon="delete"
                onPress={() => {
                    navigate("/")
                    context.set(clearCanvas())
                }}
            />
        </Surface>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 60
    },

    icon: {
        marginLeft: 12
    },

    divider: {
        marginVertical: 8
    }
})

export default ItemPanel
