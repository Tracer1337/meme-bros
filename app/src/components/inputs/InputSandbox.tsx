import React, { useState } from "react"
import { View } from "react-native"
import { Text, Surface, useTheme } from "react-native-paper"
import {
    colors,
    fontFamilies,
    fontWeights,
    textAlign,
    verticalAlign
} from "@meme-bros/client-lib"
import Screen from "../styled/Screen"
import FontFamilySelect from "./selects/FontFamilySelect"
import ColorSelect from "./selects/ColorSelect"
import FontWeightSelect from "./selects/FontWeightSelect"
import TextAlignSelect from "./selects/TextAlignSelect"
import VerticalAlignSelect from "./selects/VerticalAlignSelect"

function InputSandbox() {
    const theme = useTheme()
    
    const [color, setColor] = useState(colors[0].value)
    const [fontFamily, setFontFamily] = useState(fontFamilies[0].value)
    const [fontWeight, setFontWeight] = useState(fontWeights[0].value)
    const [vTextAlign, setVTextAlign] = useState(textAlign[0].value)
    const [vVerticalAlign, setVVerticalAlign] = useState(verticalAlign[0].value)

    const justifyContent = (verticalAlign: string) => {
        switch (verticalAlign) {
            case "top": return "flex-start"
            case "center": return "center"
            case "bottom": return "flex-end"
            default: return undefined
        }
    }

    const alignItems = (textAlign: string) => {
        switch (textAlign) {
            case "left": return "flex-start"
            case "center": return "center"
            case "right": return "flex-end"
            default: return undefined
        }
    }

    return (
        <Screen style={{ flex: 1 }}>
            <Surface style={{ padding: 32, flex: 1 }}>
                <View style={{
                    backgroundColor: theme.colors.background,
                    padding: 8,
                    marginBottom: 8,
                    height: 80,
                    justifyContent: justifyContent(vVerticalAlign),
                    alignItems: alignItems(vTextAlign)
                }}>
                    <Text style={{
                        fontSize: 24,
                        color,
                        fontFamily,
                        fontWeight
                    }}>
                        Hello World!
                    </Text>
                </View>
                <ColorSelect
                    value={color}
                    onChange={setColor}
                    label="Color"
                    style={{ marginBottom: 8 }}
                    optional
                />
                <FontFamilySelect
                    value={fontFamily}
                    onChange={setFontFamily}
                    label="Font Family"
                    style={{ marginBottom: 8 }}
                />
                <FontWeightSelect
                    value={fontWeight}
                    onChange={setFontWeight}
                    label="Font Weight"
                    style={{ marginBottom: 8 }}
                />
                <TextAlignSelect
                    value={vTextAlign}
                    onChange={setVTextAlign}
                    label="Text Align"
                    style={{ marginBottom: 8 }}
                />
                <VerticalAlignSelect
                    value={vVerticalAlign}
                    onChange={setVVerticalAlign}
                    label="Vertical Align"
                    style={{ marginBottom: 8 }}
                />
            </Surface>
        </Screen>
    )
} 

export default InputSandbox
