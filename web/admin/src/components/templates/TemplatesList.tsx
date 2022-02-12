import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Pagination,
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

function Page({ index }: { index: number }) {
    const { data, error } = api.templates.all.use({ page: index })

    const confirm = useConfirm()

    const navigate = useNavigate()

    const handleClick = (template: API.Template) => {
        navigate(template.id, { state: template as LocationState })
    }

    const handleDelete = async (template: API.Template) => {
        if (await confirm(`The template '${template.name}' will be deleted`)) {
            await api.templates.delete(template)
            api.templates.all.mutate({ page: index })
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
                                src={api.storage.templatePreview.url(template)}
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

function TemplatesList() {
    const [page, setPage] = useState(1)

    return (
        <div>
            <Page index={page - 1}/>
            <div style={{ display: "none" }}>
                <Page index={page}/>
            </div>
            <Pagination
                count={Infinity}
                page={page}
                onChange={(_e, value) => setPage(value)}
            />
        </div>
    )
}

export default TemplatesList
