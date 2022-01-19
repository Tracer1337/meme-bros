import React from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material"
import { DialogProps } from "../../lib/dialogs"

type Props = DialogProps<{ message: string }, boolean>

function ConfirmationDialog({ data, open, close }: Props) {
    return (
        <Dialog open={open} onClose={() => close(false)}>
            <DialogTitle>Confirm</DialogTitle>

            <DialogContent>{data.message}</DialogContent>

            <DialogActions>
                <Button onClick={() => close(false)}>
                    Cancel
                </Button>
                <Button onClick={() => close(true)}>
                    Ok
                </Button>                
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationDialog
