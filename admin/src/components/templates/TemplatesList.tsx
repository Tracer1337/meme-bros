import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "react-query"
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
import { useAPI } from "@meme-bros/api-sdk"
import * as API from "@meme-bros/api-sdk"
import { LocationState } from "./UpdateTemplate"
import { useConfirm } from "../../lib/confirm"
import { useSnackbar } from "../../lib/snackbar"

const PreviewImage = styled("img")({
    height: 50
})

function Item({ template }: { template: API.Template }) {
    const api = useAPI()

    const queryClient = useQueryClient()

    const navigate = useNavigate()

    const snackbar = useSnackbar()

    const [isDeleting, setIsDeleting] = useState(false)

    const deleteMutation = useMutation(
        () => api.templates.delete(template.id),
        {
            onMutate: () => setIsDeleting(true),
            onSuccess: () =>  {
                snackbar.success()
                navigate("/templates")
            },
            onError: (error) => {
                console.error(error)
                snackbar.error()
            },
            onSettled: () => {
                setIsDeleting(false)
                queryClient.invalidateQueries("templates")
            }
        }
    )

    const confirm = useConfirm()

    const handleClick = (template: API.Template) => {
        navigate(template.id, { state: template as LocationState })
    }

    const handleDelete = async (template: API.Template) => {
        if (await confirm(`The template '${template.name}' will be deleted`)) {
            deleteMutation.mutate()
        }
    }

    return (
        <ListItem
            key={template.id}
            secondaryAction={
                <IconButton
                    edge="end"
                    onClick={() => handleDelete(template)}
                    disabled={isDeleting}
                >
                    <DeleteIcon/>
                </IconButton>
            }
        >
            <ListItemButton onClick={() => handleClick(template)}>
                <Box sx={{ minWidth: 100 }}>
                    <PreviewImage
                        src={api.storage.url(template.previewFile)}
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
    )
}

function TemplatesList() {
    const api = useAPI()
    
    const queryClient = useQueryClient()
    
    const [page, setPage] = useState(0)

    const {
        isLoading,
        isError,
        data
    } = useQuery(
        ["templates", page],
        () => api.templates.getAll({ page, per_page: 10 })
    )

    useEffect(() => {
        queryClient.prefetchQuery(
            ["templates", page + 1],
            () => api.templates.getAll({
                page: page + 1,
                per_page: 10
            })
        )
    }, [api, queryClient, page])

    if (isLoading) return <div>Loading...</div>
    if (isError || !data) return <div>Failed to load</div>

    return (
        <div>
            <List sx={{
                height: 700,
                overflowY: "auto"
            }}>
                {data.map((template) => <Item template={template} key={template.id}/>)}
            </List>
            <Pagination
                count={Infinity}
                page={page + 1}
                onChange={(_e, value) => setPage(value - 1)}
            />
        </div>
    )
}

export default TemplatesList
