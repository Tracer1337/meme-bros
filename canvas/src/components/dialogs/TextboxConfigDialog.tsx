import React, { useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch, TextField } from "@mui/material"
import { DialogProps } from "../../lib/DialogHandler"
import { PickElement } from "../../types"
import { getTextboxStyles } from "../elements/Textbox"
import { colors, fontFamilies, fontWeights, textAlign } from "../inputs/items"
import Select from "../inputs/Select"

type Props = DialogProps<PickElement<"textbox">, PickElement<"textbox">["data"]>

function TextboxConfigDialog({ open, data: element, close }: Props) {
    const [data, setData] = useState(element.data)

    const getInputProps = (
        label: string,
        key: keyof typeof data
    ): React.ComponentProps<typeof TextField> => ({
        label,
        fullWidth: true,
        margin: "dense",
        variant: "standard",
        value: data[key],
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            const newData = { ...data, [key]: event.target.value }
            setData(newData)
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
                <Select {...getInputProps("Color", "color")} options={colors} />

                <TextField {...getInputProps("Outline Width", "outlineWidth")} type="number" />
                
                <Select {...getInputProps("Outline Color", "outlineColor")} options={colors} />

                <Select {...getInputProps("Text Align", "textAlign")} options={textAlign} />

                <Select {...getInputProps("Font Family", "fontFamily")} options={fontFamilies} />

                <Select {...getInputProps("Font Weight", "fontWeight")} options={fontWeights} />

                <FormControlLabel
                    label="Caps"
                    control={<Switch onChange={(_, caps) => setData({ ...data, caps })} checked={data.caps}/>}
                />
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
