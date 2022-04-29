import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import {
    IconButton,
    List,
    ListItem,
    Pagination,
    styled
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import * as API from "@meme-bros/api-sdk"
import { useAPI } from "@meme-bros/api-sdk"
import { useConfirm } from "../../lib/confirm"
import { useSnackbar } from "../../lib/snackbar"

const PreviewImage = styled("img")({
    height: 100
})

function Item({ upload }: { upload: API.Upload }) {
    const api = useAPI()

    const queryClient = useQueryClient()

    const snackbar = useSnackbar()

    const [isDeleting, setIsDeleting] = useState(false)

    const deleteMutation = useMutation(
        () => api.uploads.delete(upload.id),
        {
            onMutate: () => setIsDeleting(true),
            onSuccess: () => snackbar.success(),
            onError: (error) => {
                console.error(error)
                snackbar.error()
            },
            onSettled: () => {
                setIsDeleting(false)
                queryClient.invalidateQueries("uploads")
            }
        }
    )

    const confirm = useConfirm()
    
    const handleDelete = async (upload: API.Upload) => {
        if (await confirm(`The upload '${upload.id}' will be deleted`)) {
            deleteMutation.mutate()
        }
    }

    return (
        <ListItem
            key={upload.id}
            secondaryAction={
                <IconButton
                    edge="end"
                    onClick={() => handleDelete(upload)}
                    disabled={isDeleting}
                >
                    <DeleteIcon/>
                </IconButton>
            }
        >
            <PreviewImage src={upload.link} alt="Preview"/>
        </ListItem>
    )
}

function UploadsList() {
    const api = useAPI()

    const queryClient = useQueryClient()
    
    const [page, setPage] = useState(0)

    const {
        isLoading,
        isError,
        data
    } = useQuery(
        ["uploads", page],
        () => api.uploads.getAll({ page, per_page: 10 })
    )

    useEffect(() => {
        queryClient.prefetchQuery(
            ["uploads", page + 1],
            () => api.uploads.getAll({
                page: page + 1,
                per_page: 10
            })
        )
    }, [api, queryClient, page])

    if (isLoading) return <div>Loading...</div>
    if (isError || !data) return <div>Failed to load</div>
    
    return (
        <>
            <List>
                {data.map((upload) => <Item upload={upload} key={upload.id}/>)}
            </List>
            <Pagination
                count={Infinity}
                page={page + 1}
                onChange={(_e, value) => setPage(value - 1)}
            />
        </>
    )
}

export default UploadsList
