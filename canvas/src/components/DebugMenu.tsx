import { Button, Paper, Typography, TextField, styled } from "@mui/material"
import { useState } from "react"
import { copyElement, useSharedContext } from "@meme-bros/client-lib"

const Action = styled(Button)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    width: "100%",
    justifyContent: "flex-start"
}))

function DebugMenu() {
    const context = useSharedContext()

    const [copyId, setCopyId] = useState(0)

    const event = (event: any, data?: any) => () => {
        context.events.emit(event, data)
    }
    
    return (
        <Paper sx={{
            padding: 2,
            width: 200
        }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>Elements</Typography>
            <Action onClick={event("element.create.default", "textbox")}>Add Textbox</Action>
            <Action onClick={event("element.create.default", "image")}>Add Image</Action>
            <Action onClick={event("element.create.default", "shape")}>Add Shape</Action>
            <Action onClick={event("element.create.default", "path")}>Add Path</Action>

            <Typography variant="h5" sx={{ marginBottom: 2 }}>Canvas</Typography>
            <TextField
                label="Width"
                type="number"
                margin="dense"
                value={context.canvas.width}
                onChange={(event) => {
                    context.set({ canvas: {
                        width: parseInt(event.target.value)
                    } })
                }}
            />
            <TextField
                label="Height"
                type="number"
                margin="dense"
                value={context.canvas.height}
                onChange={(event) => {
                    context.set({ canvas: {
                        height: parseInt(event.target.value)
                    } })
                }}
            />
            <TextField
                label="Copy ID"
                type="number"
                margin="dense"
                value={copyId}
                onChange={(event) => setCopyId(parseInt(event.target.value))}
            />
            <Action onClick={() => context.set(copyElement(context, copyId))}>Copy</Action>

            <Typography variant="h5" sx={{ marginBottom: 2 }}>History</Typography>
            <Action onClick={event("history.push")}>Push</Action>
            <Action onClick={event("history.pop")}>Pop</Action>

            <Typography variant="h5" sx={{ marginBottom: 2 }}>Dialogs</Typography>
            <Action onClick={event("canvas.base.config")}>Base Config</Action>
        </Paper>
    )
}

export default DebugMenu
