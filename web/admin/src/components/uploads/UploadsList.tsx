import React, { useState } from "react"
import {  List, ListItem, Pagination, styled } from "@mui/material"
import { useAdminAPI } from "@meme-bros/api-sdk/dist/admin"

const PreviewImage = styled("img")({
    height: 100
})

function Page({ index }: { index: number }) {
    const api = useAdminAPI()

    const { data, error } = api.uploads.all.use({ page: index })

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    return (
        <List>
            {data.map((upload) => (
                <ListItem key={upload.id}>
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
