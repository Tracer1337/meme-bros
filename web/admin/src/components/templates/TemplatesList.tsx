import React from "react"
import { Box, List, ListItem, ListItemButton, ListItemText, styled, Typography } from "@mui/material"
import useSWR from "swr"
import { API, fetcher } from "../../lib/api"

const PreviewImage = styled("img")({
    height: 50
})

function TemplatesList({ onClick }: {
    onClick: (template: API.Template) => void
}) {
    const { data, error } = useSWR<API.Template[]>("templates", fetcher)

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    return (
        <List>
            {data.map((template) => (
                <ListItem key={template.id}>
                    <ListItemButton onClick={() => onClick(template)}>
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
