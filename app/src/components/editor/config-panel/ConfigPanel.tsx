import React from "react"
import { StyleSheet } from "react-native"
import { Surface } from "react-native-paper"
import CanvasConfig from "./CanvasConfig"
import TextboxElementConfig from "./TextboxElementConfig"
import ImageElementConfig from "./ImageElementConfig"
import ShapeElementConfig from "./ShapeElementConfig"
import DrawingConfig from "./DrawingConfig"
import { ActionPanelModes, useActionPanel } from "../utils/panels"

const panels: Record<ActionPanelModes, React.FunctionComponent> = {
    [ActionPanelModes.CANVAS]: CanvasConfig,
    [ActionPanelModes.DRAWING]: DrawingConfig,
    [ActionPanelModes.TEXTBOX_ELEMENT]: TextboxElementConfig,
    [ActionPanelModes.IMAGE_ELEMENT]: ImageElementConfig,
    [ActionPanelModes.SHAPE_ELEMENT]: ShapeElementConfig
}

function ConfigPanel() {
    const panel = useActionPanel(panels)
    
    return (
        <Surface style={styles.container}>
            {React.createElement(panel)}
        </Surface>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 300,
        padding: 8
    }
})

export default ConfigPanel
