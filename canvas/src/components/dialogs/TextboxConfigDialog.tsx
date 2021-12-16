import React, { useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { DialogProps } from "../../lib/DialogHandler"
import { PickElement } from "../../types"
import { getTextboxStyles } from "../elements/Textbox"
import { colors, fontFamilies, fontWeights, textAlign } from "../inputs/items"
import Select from "../inputs/Select"
import Switch from "../inputs/Switch"

type Props = DialogProps<PickElement<"textbox">, PickElement<"textbox">["data"]>

function TextboxConfigDialog({ open, data: element, close }: Props) {
    const [data, setData] = useState(element.data)

    const getTextFieldProps = (
        label: string,
        key: keyof typeof data
    ): React.ComponentProps<typeof TextField> => ({
        label,
        fullWidth: true,
        margin: "dense",
        variant: "standard",
        value: data[key],
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            setData({ ...data, [key]: event.target.value })
        }
    })

    const getBooleanFieldProps = (
        label: string,
        key: keyof typeof data
    ): React.ComponentProps<typeof Switch> => ({
        label,
        checked: data[key] as boolean,
        sx: { marginTop: 1, marginBottom: 0.5 },
        onChange: (_, value) => {
            setData({ ...data, [key]: value })
        }
    })
    
    return (
        <Dialog open={open} onClose={() => close(element.data)} fullWidth>
            <DialogTitle>
                <div style={getTextboxStyles({ ...element, data })}>
                    {element.data.text}
                </div>
            </DialogTitle>

            <DialogContent>
                <Select {...getTextFieldProps("Color", "color")} options={colors} />

                <TextField {...getTextFieldProps("Outline Width", "outlineWidth")} type="number" />
                
                <Select {...getTextFieldProps("Outline Color", "outlineColor")} options={colors} />

                <Select {...getTextFieldProps("Text Align", "textAlign")} options={textAlign} />

                <Select {...getTextFieldProps("Font Family", "fontFamily")} options={fontFamilies} />

                <Select {...getTextFieldProps("Font Weight", "fontWeight")} options={fontWeights} />

                <Switch {...getBooleanFieldProps("Caps", "caps")} />
            </DialogContent>
            
            <DialogActions>
                <Button fullWidth onClick={() => close(data)}>
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default TextboxConfigDialog
