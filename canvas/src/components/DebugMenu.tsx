import { Button, Paper, Typography, TextField, styled } from "@mui/material"
import { useContext, useState } from "react"
import { CanvasContext, copyElement, Events } from "./Context"

const Action = styled(Button)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    width: "100%",
    justifyContent: "flex-start"
}))

function DebugMenu() {
    const context = useContext(CanvasContext)

    const [copyId, setCopyId] = useState(0)

    const event = <T extends keyof Events>(
        event: T,
        data: Events[T]
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
            <Action onClick={() => context.push()}>Push</Action>
            <Action onClick={() => context.pop()}>Pop</Action>
        </Paper>
    )
}

export default DebugMenu
