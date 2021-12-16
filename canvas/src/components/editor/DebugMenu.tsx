import { Button, Paper, Typography, Box } from "@mui/material"
import { useContext } from "react"
import { EditorContext, Events } from "./Context"

function Action({ children, onClick }: {
    children: string,
    onClick: () => void
}) {
    return (
        <Box sx={{ marginBottom: 1 }}>
            <Button onClick={onClick}>{children}</Button>
        </Box>
    )
}

function DebugMenu() {
    const context = useContext(EditorContext)

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
            <Action onClick={event("element.create", "textbox")}>Add Textbox</Action>
            <Action onClick={event("element.create", "image")}>Add Image</Action>
            <Action onClick={event("element.create", "shape")}>Add Shape</Action>
        </Paper>
    )
}

export default DebugMenu
