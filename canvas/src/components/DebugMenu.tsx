import {
    Button,
    Paper,
    Typography,
    TextField,
    styled,
    FormControlLabel,
    Switch
} from "@mui/material"
import { useState } from "react"
import { copyElement, enableDrawing, useSharedContext } from "@meme-bros/client-lib"

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
            padding: 3,
            width: 250,
            height: "100%",
            overflow: "auto"
        }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>Elements</Typography>
            <Action onClick={event("element.create.default", "textbox")}>Add Textbox</Action>
            <Action onClick={event("element.create.default", "image")}>Add Image</Action>
            <Action onClick={event("element.create.default", "shape")}>Add Shape</Action>

            <Typography variant="h5" sx={{ marginBottom: 2 }}>Drawing</Typography>
            <FormControlLabel
                label="Drawing"
                control={
                    <Switch
                        checked={context.drawing.isDrawing}
                        onChange={(event) => context.set({
                            ...enableDrawing(),
                            drawing: { isDrawing: event.target.checked }
                        })}
                    />
                }
            />
            <TextField
                label="Color"
                margin="dense"
                value={context.drawing.color}
                onChange={(event) => context.set({
                    drawing: { color: event.target.value }
                })}
            />
            <TextField
                label="Width"
                type="number"
                margin="dense"
                value={context.drawing.width}
                onChange={(event) => context.set({
                    drawing: { width: parseInt(event.target.value) }
                })}
            />

            <Typography variant="h5" sx={{ marginBottom: 2 }}>Canvas</Typography>
            <TextField
                label="Width"
                type="number"
                margin="dense"
                value={context.canvas.width}
                onChange={(event) => context.set({
                    canvas: { width: parseInt(event.target.value) }
                })}
            />
            <TextField
                label="Height"
                type="number"
                margin="dense"
                value={context.canvas.height}
                onChange={(event) => context.set({
                    canvas: { height: parseInt(event.target.value) }
                })}
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

            <Typography variant="h5" sx={{ marginBottom: 2 }}>Misc</Typography>
            <Action onClick={event("canvas.base.config")}>Base Config</Action>
        </Paper>
    )
}

export default DebugMenu
