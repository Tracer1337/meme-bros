import { Button, Dialog, DialogActions, DialogContent } from "@mui/material"
import { useState } from "react"
import { Editor } from "@meme-bros/shared"
import { DialogProps } from "../../lib/DialogHandler"
import Switch from "../inputs/Switch"

type Props = DialogProps<Editor.CanvasBase, Editor.CanvasBase>

function CanvasBaseConfigDialog({ open, data: input, close }: Props) {
    const [data, setData] = useState(input)

    return (
        <Dialog open={open} onClose={() => close(input)} fullWidth>
            <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
                <Switch
                    label="Rounded Corners"
                    checked={data.rounded}
                    sx={{ marginTop: 1, marginBottom: 0.5 }}
                    onChange={(_, value) => setData({
                        ...data,
                        rounded: value
                    })}
                />
                <Switch
                    label="Spacing"
                    checked={data.padding}
                    sx={{ marginTop: 1, marginBottom: 0.5 }}
                    onChange={(_, value) => setData({
                        ...data,
                        padding: value
                    })}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={() => close(data)} sx={{ width: "100%" }}>
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CanvasBaseConfigDialog
