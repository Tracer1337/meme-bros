import { Button, Paper, Typography, TextField, styled } from "@mui/material"
import { useState } from "react"
import { copyElement, SharedContext, useSharedContext } from "@meme-bros/shared"

const Action = styled(Button)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    width: "100%",
    justifyContent: "flex-start"
}))

function DebugMenu() {
    const context = useSharedContext()

    const [copyId, setCopyId] = useState(0)

    const event = <T extends keyof SharedContext.Events>(
        event: T,
        data: SharedContext.Events[T]
    ) => () => {
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
            <Action onClick={event("history.push", null)}>Push</Action>
            <Action onClick={event("history.pop", null)}>Pop</Action>

            <Typography variant="h5" sx={{ marginBottom: 2 }}>Dialogs</Typography>
            <Action onClick={event("classic.base.config", null)}>Base Config</Action>
        </Paper>
    )
}

export default DebugMenu
