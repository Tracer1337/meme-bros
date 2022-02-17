import { useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, TextField } from "@mui/material"
import { colors, SharedContext } from "@meme-bros/client-lib"
import { DialogProps } from "../../lib/DialogHandler"
import Select from "../inputs/Select"

type Props = DialogProps<SharedContext.ContextValue["drawing"]>

function DrawingConfigDialog({ open, data: config, close }: Props) {
    const [data, setData] = useState(config)

    return (
        <Dialog open={open} onClose={() => close(config)} fullWidth>
            <DialogContent>
                <Select
                    label="Color"
                    fullWidth
                    margin="dense"
                    variant="standard"
                    options={colors}
                    value={data.color}
                    onChange={(event) => {
                        setData({
                            ...data,
                            color: event.target.value
                        })
                    }}
                />
                <TextField
                    label="Width"
                    fullWidth
                    margin="dense"
                    variant="standard"
                    type="number"
                    value={data.width}
                    onChange={(event) => {
                        setData({
                            ...data,
                            width: parseInt(event.target.value)
                        })
                    }}
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

export default DrawingConfigDialog
