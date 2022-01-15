import React from "react"
import { useNavigate } from "react-router-dom"
import useSWR from "swr"
import { Box, IconButton, List, ListItem, ListItemButton, ListItemText, styled, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import { API, fetcher } from "../../lib/api"

const PreviewImage = styled("img")({
    height: 50
})

function TemplatesList() {
    const { data, error, mutate } = useSWR<API.Template[]>("templates", fetcher)

    const navigate = useNavigate()

    const handleClick = (template: API.Template) => {
        navigate(template.id)
    }

    const handleDelete = async (template: API.Template) => {
        await API.deleteTemplate(template.id)
        mutate()
    }

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    return (
        <List>
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
                                src={API.getPreviewURL(template)}
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
