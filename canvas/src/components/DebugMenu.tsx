import { Button, Paper, Typography, TextField, styled, Box } from "@mui/material"
import { Editor } from "@meme-bros/shared"
import {
    copyElement,
    removeElement,
    enableDrawing,
    useSharedContext
} from "@meme-bros/client-lib"
import Switch from "./inputs/Switch"

function useFocusedElement<T extends Editor.CanvasElement["type"]>() {
    const context = useSharedContext()

    return context.canvas.elements[
        context.focus ?? -1
    ] as Editor.PickElement<T> | undefined
}

const Action = styled(Button)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    width: "100%",
    justifyContent: "flex-start"
}))

function DebugMenu() {
    const context = useSharedContext()

    const element = useFocusedElement()

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
            <Typography variant="h5" sx={{ mb: 2 }}>Elements</Typography>
            <Action onClick={event("element.create.default", "textbox")}>Add Textbox</Action>
            <Action onClick={event("element.create.default", "image")}>Add Image</Action>
            <Action onClick={event("element.create.default", "shape")}>Add Shape</Action>

            {element && (
                <>
                    <Typography variant="h5" sx={{ mb: 2 }}>{element.type}</Typography>
                    <Action onClick={() => context.set(copyElement(context, element.id))}>Copy</Action>
                    <Action onClick={() => context.set(removeElement(context, element.id))}>Remove</Action>
                </>
            )}

            <Typography variant="h5" sx={{ mb: 2 }}>Drawing</Typography>
            <Switch
                label="Drawing"
                checked={context.drawing.isDrawing}
                onChange={(event) => context.set({
                    ...enableDrawing(),
                    drawing: { isDrawing: event.target.checked }
                })}
            />
            <Box mb={2}/>

            <Typography variant="h5" sx={{ mb: 2 }}>Canvas</Typography>
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

            <Typography variant="h5" sx={{ mb: 2 }}>History</Typography>
            <Action onClick={event("history.push")}>Push</Action>
            <Action onClick={event("history.pop")}>Pop</Action>

            <Typography variant="h5" sx={{ mb: 2 }}>Misc</Typography>
            <Action onClick={event("canvas.base.config")}>Base Config</Action>
        </Paper>
    )
}

export default DebugMenu
