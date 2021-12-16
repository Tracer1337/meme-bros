import { Button, Dialog, DialogActions } from "@mui/material"
import { useState } from "react"
import { DialogProps } from "../../lib/DialogHandler"
import { PickElement } from "../../types"

type Props = DialogProps<PickElement<"image">, PickElement<"image">["data"]>

function ImageConfigDialog({ open, data: element, close }: Props) {
    const [data, setData] = useState(element.data)
    
    return (
        <Dialog open={open} onClose={() => close(element.data)}>
            <DialogActions>
                <Button onClick={() => close(data)} sx={{ width: "100%" }}>
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ImageConfigDialog
