import { useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { Container, Typography } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { useAPI } from "@meme-bros/api-sdk"
import * as API from "@meme-bros/api-sdk"
import StickersList from "./StickersList"
import { importImage } from "../../lib/file"
import { useSnackbar } from "../../lib/snackbar"

function StickersPage() {
    const api = useAPI()

    const queryClient = useQueryClient()
    
    const snackbar = useSnackbar()

    const [isLoading, setIsLoading] = useState(false)

    const createMutation = useMutation(
        (payload: API.CreateSticker) => api.stickers.create(payload),
        {
            onMutate: () => setIsLoading(true),
            onSuccess: () => snackbar.success(),
            onError: (error) => {
                console.error(error)
                snackbar.error()
            },
            onSettled: () => {
                setIsLoading(false)
                queryClient.invalidateQueries("stickers")
            }
        }
    )

    const handleCreate = async () => {
        const image = await importImage()
        if (!image) {
            snackbar.info("Cancelled")
            return
        }
        createMutation.mutate({ uri: image.base64 })
    }

    return (
        <>
            <Typography variant="h3" mx={2} mt={4}>
                Stickers
            </Typography>

            <Container maxWidth="sm">
                <LoadingButton
                    onClick={handleCreate}
                    loading={isLoading}
                >
                    New
                </LoadingButton>
                <StickersList/>
            </Container>
        </>
    )
}

export default StickersPage
