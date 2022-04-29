import { styled } from "@mui/material"
import * as API from "@meme-bros/api-sdk"
import { useAPI } from "@meme-bros/api-sdk"
import List from "../list/List"

const PreviewImage = styled("img")({
    height: 100
})

function UploadsList() {
    const api = useAPI()

    return (
        <List
            keyExtractor={(item: API.Upload) => item.id}
            queryKey="uploads"
            query={(params) => api.uploads.getAll(params)}
            deleteMutation={(item) => api.uploads.delete(item.id)}
            itemComponent={({ item }) => (
                <PreviewImage src={item.link} alt="Preview"/>
            )}
        />
    )
}

export default UploadsList
