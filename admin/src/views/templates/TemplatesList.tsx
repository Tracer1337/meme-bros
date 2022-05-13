import { useNavigate } from "react-router-dom"
import {
    Box,
    ListItemButton,
    ListItemText,
    styled,
    Typography
} from "@mui/material"
import { useAPI } from "@meme-bros/api-sdk"
import * as API from "@meme-bros/api-sdk"
import List from "@components/list/List"
import { LocationState } from "./UpdateTemplate"

const PreviewImage = styled("img")({
    height: 50
})

function TemplatesList() {
    const api = useAPI()

    const navigate = useNavigate()
    
    const handleClick = (template: API.Template) => {
        navigate(template.id, { state: template as LocationState })
    }
    
    return (
        <List
            sx={{ height: 650, overflowY: "auto" }}
            searchable
            keyExtractor={(item: API.Template) => item.id}
            labelExtractor={(item) => item.name}
            queryKey="templates"
            query={(params) => api.templates.getAll(params)}
            onDelete={() => navigate("/templates")}
            deleteMutation={(item) => api.templates.delete(item.id)}
            itemComponent={({ item }) => (
                <ListItemButton onClick={() => handleClick(item)}>
                    <Box sx={{ minWidth: 100 }}>
                        <PreviewImage
                            src={api.storage.url(item.previewFile)}
                            alt="Preview"
                        />
                    </Box>

                    <ListItemText>
                        <Box>{item.name}</Box>
                        <Typography variant="caption">
                            {item.uses}
                        </Typography>
                    </ListItemText>
                </ListItemButton>
            )}
        />
    )
}

export default TemplatesList
