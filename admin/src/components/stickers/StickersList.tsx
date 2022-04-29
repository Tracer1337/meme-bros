import { Box, Typography, styled } from "@mui/material"
import * as API from "@meme-bros/api-sdk"
import { useAPI } from "@meme-bros/api-sdk"
import List from "../list/List"

const PreviewImage = styled("img")({
    height: 100
})

function StickersList() {
    const api = useAPI()

    return (
        <List
            keyExtractor={(item: API.Sticker) => item.filename}
            queryKey="stickers"
            query={(params) => api.stickers.getAll(params)}
            deleteMutation={(item) => api.stickers.delete(item.filename)}
            itemComponent={({ item }) => (
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexGrow: 1,
                    pr: 4
                }}>
                    <PreviewImage src={api.storage.url(item.filename)} alt="Preview"/>
                    <Typography>
                        {item.uses}
                    </Typography>
                </Box>
            )}
        />
    )
}

export default StickersList
