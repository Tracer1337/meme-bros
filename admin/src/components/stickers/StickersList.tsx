import React, { useEffect, useState } from "react"
import { useQueryClient, useQuery, useMutation } from "react-query"
import {
    IconButton,
    List,
    ListItem,
    Pagination,
    styled,
    Typography
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import * as API from "@meme-bros/api-sdk"
import { useAPI } from "@meme-bros/api-sdk"
import { useConfirm } from "../../lib/confirm"
import { Box } from "@mui/system"
import { useSnackbar } from "../../lib/snackbar"

const PreviewImage = styled("img")({
    height: 100
})

function Item({ sticker }: { sticker: API.Sticker }) {
    const api = useAPI()

    const queryClient = useQueryClient()

    const snackbar = useSnackbar()

    const [isDeleting, setIsDeleting] = useState(false)

    const deleteMutation = useMutation(
        () => api.stickers.delete(sticker.filename),
        {
            onMutate: () => setIsDeleting(true),
            onSuccess: () => snackbar.success(),
            onError: (error) => {
                console.error(error)
                snackbar.error()
            },
            onSettled: () => {
                setIsDeleting(false)
                queryClient.invalidateQueries("stickers")
            }
        }
    )

    const confirm = useConfirm()

    const handleDelete = async (sticker: API.Sticker) => {
        if (await confirm(`The sticker '${sticker.filename}' will be deleted`)) {
            deleteMutation.mutate()
        }
    }

    return (
        <ListItem
            key={sticker.filename}
            secondaryAction={
                <IconButton
                    edge="end"
                    onClick={() => handleDelete(sticker)}
                    disabled={isDeleting}
                >
                    <DeleteIcon/>
                </IconButton>
            }
        >
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexGrow: 1,
                pr: 4
            }}>
                <PreviewImage src={api.storage.url(sticker.filename)} alt="Preview"/>
                <Typography>
                    {sticker.uses}
                </Typography>
            </Box>
        </ListItem>
    )
}

function StickersList() {
    const api = useAPI()

    const queryClient = useQueryClient()

    const [page, setPage] = useState(0)

    const {
        isLoading,
        isError,
        data
    } = useQuery(
        ["stickers", page],
        () => api.stickers.getAll({ page, per_page: 10 }),
    )

    useEffect(() => {
        queryClient.prefetchQuery(
            ["stickers", page + 1],
            () => api.stickers.getAll({
                page: page + 1,
                per_page: 10
            })
        )
    }, [queryClient, api, page])
    
    if (isLoading) return <div>Loading...</div>
    if (isError || !data) return <div>Failed to load</div>
    
    return (
        <>
            <List>
                {data.map((sticker) => <Item sticker={sticker} key={sticker.filename}/>)}
            </List>
            <Pagination
                count={Infinity}
                page={page + 1}
                onChange={(_e, value) => setPage(value - 1)}
            />
        </>
    )
}

export default StickersList
