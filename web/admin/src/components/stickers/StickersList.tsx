import React, { useState } from "react"
import {
    IconButton,
    List,
    ListItem,
    Pagination,
    styled
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import * as API from "@meme-bros/api-sdk/dist/admin"
import { useAdminAPI } from "@meme-bros/api-sdk/dist/admin"
import { useConfirm } from "../../lib/confirm"

const PreviewImage = styled("img")({
    height: 100
})

function Page({ index }: { index: number }) {
    const api = useAdminAPI()

    const { data, error } = api.stickers.all.use({ page: index })

    const confirm = useConfirm()
    
    const handleDelete = async (sticker: API.Sticker) => {
        if (await confirm(`The sticker '${sticker.filename}' will be deleted`)) {
            await api.stickers.delete(sticker)
            api.stickers.all.mutate()
        }
    }
    
    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    return (
        <List>
            {data.map((sticker) => (
                <ListItem
                    key={sticker.filename}
                    secondaryAction={
                        <IconButton
                            edge="end"
                            onClick={() => handleDelete(sticker)}
                        >
                            <DeleteIcon/>
                        </IconButton>
                    }
                >
                    <PreviewImage src={api.storage.sticker.url(sticker)} alt="Preview"/>
                </ListItem>
            ))}
        </List>
    )
}

function StickersList() {
    const [page, setPage] = useState(1)
    
    return (
        <>
            <Page index={page - 1}/>
            <div style={{ display: "none" }}>
                <Page index={page}/>
            </div>
            <Pagination
                count={Infinity}
                page={page}
                onChange={(_e, value) => setPage(value)}
            />
        </>
    )
}

export default StickersList
