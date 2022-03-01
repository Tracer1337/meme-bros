import React, { useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import { Surface } from "react-native-paper"
import { Editor } from "@meme-bros/shared"
import { useSharedContext } from "@meme-bros/client-lib"
import CanvasConfig from "./CanvasConfig"
import TextboxElementConfig from "./TextboxElementConfig"
import ImageElementConfig from "./ImageElementConfig"
import ShapeElementConfig from "./ShapeElementConfig"
import DrawingConfig from "./DrawingConfig"

enum ConfigBarMode {
    CANVAS,
    TEXTBOX_ELEMENT,
    IMAGE_ELEMENT,
    SHAPE_ELEMENT,
    DRAWING
}

const elementModes: Record<Editor.CanvasElement["type"], ConfigBarMode> = {
    "textbox": ConfigBarMode.TEXTBOX_ELEMENT,
    "image": ConfigBarMode.IMAGE_ELEMENT,
    "shape": ConfigBarMode.SHAPE_ELEMENT
}

const actionBars: Record<ConfigBarMode, React.FunctionComponent> = {
    [ConfigBarMode.CANVAS]: CanvasConfig,
    [ConfigBarMode.TEXTBOX_ELEMENT]: TextboxElementConfig,
    [ConfigBarMode.IMAGE_ELEMENT]: ImageElementConfig,
    [ConfigBarMode.SHAPE_ELEMENT]: ShapeElementConfig,
    [ConfigBarMode.DRAWING]: DrawingConfig
}

function ConfigBar() {    
    const context = useSharedContext()

    const [mode, setMode] = useState<ConfigBarMode>(ConfigBarMode.CANVAS)

    useEffect(() => {
        const element = context.canvas.elements[context.focus || -1]
        if (context.drawing.isDrawing) {
            setMode(ConfigBarMode.DRAWING)
        } else if (context.focus === null) {
            setMode(ConfigBarMode.CANVAS)
        } else {
            setMode(elementModes[element.type])
        }
    }, [context])

    return (
        <Surface style={styles.container}>
            {React.createElement(actionBars[mode])}
        </Surface>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 300,
        padding: 8
    }
})

export default ConfigBar
