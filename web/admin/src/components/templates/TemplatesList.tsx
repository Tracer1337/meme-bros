import React from "react"
import { useNavigate } from "react-router-dom"
import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    styled,
    Typography
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import * as API from "@meme-bros/api-sdk/dist/admin/types"
import { api } from "@meme-bros/api-sdk/dist/admin/api"
import { LocationState } from "./UpdateTemplate"
import { useConfirm } from "../../lib/confirm"

const PreviewImage = styled("img")({
    height: 50
})

function TemplatesList() {
    const { data, error } = api.templates.all.use()

    const confirm = useConfirm()

    const navigate = useNavigate()

    const handleClick = (template: API.Template) => {
        navigate(template.id, { state: template as LocationState })
    }

    const handleDelete = async (template: API.Template) => {
        if (await confirm(`The template '${template.name}' will be deleted`)) {
            await api.templates.delete(template)
            api.templates.all.mutate()
            navigate("/templates")
        }
    }

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    return (
        <List sx={{
            height: 700,
            overflowY: "auto"
        }}>
            {data.map((template) => (
                <ListItem
                    key={template.id}
                    secondaryAction={
                        <IconButton
                            edge="end"
                            onClick={() => handleDelete(template)}
                        >
                            <DeleteIcon/>
                        </IconButton>
                    }
                >
                    <ListItemButton onClick={() => handleClick(template)}>
                        <Box sx={{ minWidth: 100 }}>
                            <PreviewImage
                                src={api.storage.getTemplatePreviewURL(template)}
                                alt="Preview"
                            />
                        </Box>

                        <ListItemText>
                            <Box>{template.name}</Box>
                            <Typography variant="caption">
                                {template.uses}
                            </Typography>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}

export default TemplatesList
