import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { DialogProps } from "../../lib/DialogHandler"
import { PickElement } from "../../types"
import { getTextboxStyles } from "../elements/Textbox"
import { colors, fontFamilies, fontWeights, textAlign } from "../inputs/items"
import Select from "../inputs/Select"
import Switch from "../inputs/Switch"
import { useConfigDialog } from "./utils/useConfigDialog"

type Props = DialogProps<PickElement<"textbox">, PickElement<"textbox">["data"]>

function TextboxConfigDialog({ open, data: element, close }: Props) {
    const { data, getTextFieldProps, getBooleanFieldProps } = useConfigDialog(element)
    
    return (
        <Dialog open={open} onClose={() => close(element.data)} fullWidth>
            <DialogTitle>
                <div style={getTextboxStyles({ ...element, data })}>
                    {element.data.text}
                </div>
            </DialogTitle>

            <DialogContent>
                <Select options={colors} {...getTextFieldProps("Color", "color")} />
                <TextField type="number" {...getTextFieldProps("Outline Width", "outlineWidth")} />
                <Select options={colors} {...getTextFieldProps("Outline Color", "outlineColor")} />
                <Select options={textAlign} {...getTextFieldProps("Text Align", "textAlign")} />
                <Select options={fontFamilies} {...getTextFieldProps("Font Family", "fontFamily")} />
                <Select options={fontWeights} {...getTextFieldProps("Font Weight", "fontWeight")} />
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
