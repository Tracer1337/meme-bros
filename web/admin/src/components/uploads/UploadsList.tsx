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

    const { data, error } = api.uploads.all.use({ page: index })

    const confirm = useConfirm()
    
    const handleDelete = async (upload: API.Upload) => {
        if (await confirm(`The upload '${upload.id}' will be deleted`)) {
            await api.uploads.delete(upload)
            api.uploads.all.mutate()
        }
    }
    
    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    return (
        <List>
            {data.map((upload) => (
                <ListItem
                    key={upload.id}
                    secondaryAction={
                        <IconButton
                            edge="end"
                            onClick={() => handleDelete(upload)}
                        >
                            <DeleteIcon/>
                        </IconButton>
                    }
                >
                    <PreviewImage src={upload.link} alt="Preview"/>
                </ListItem>
            ))}
        </List>
    )
}

function UploadsList() {
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

export default UploadsList
