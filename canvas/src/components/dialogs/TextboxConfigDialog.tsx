import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material"
import { useState } from "react"
import { DialogProps } from "../../lib/DialogHandler"
import { PickElement } from "../../types"
import { getTextboxStyles } from "../elements/Textbox"
import { colors } from "./items"

type Props = DialogProps<PickElement<"textbox">, PickElement<"textbox">["data"]>

function TextboxConfigDialog({ open, data: element, close }: Props) {
    const [data, setData] = useState(element.data)
    
    return (
        <Dialog open={open} onClose={() => close(element.data)} fullWidth>
            <DialogTitle>
                <div style={getTextboxStyles({ ...element, data })}>
                    {element.data.text}
                </div>
            </DialogTitle>

            <DialogContent>
                <TextField
                    select
                    fullWidth
                    variant="standard"
                    label="Color"
                    value={data.color}
                    onChange={(event) => setData({
                        ...data,
                        color: event.target.value
                    })}
                >
                    {colors.map(({ label, value }) => (
                        <MenuItem key={value} value={value}>{label}</MenuItem>
                    ))}
                </TextField>
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
