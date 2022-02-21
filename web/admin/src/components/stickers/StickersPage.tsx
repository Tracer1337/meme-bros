import React, { useState } from "react"
import { Container, Typography } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { useAdminAPI } from "@meme-bros/api-sdk/dist/admin"
import StickersList from "./StickersList"
import { importImage } from "../../lib/file"
import { useSnackbar } from "../../lib/snackbar"

function StickersPage() {
    const api = useAdminAPI()

    const snackbar = useSnackbar()

    const [isLoading, setIsLoading] = useState(false)

    const handleCreate = async () => {
        const image = await importImage()
        if (!image) {
            snackbar.info("Cancelled")
            return
        }
        setIsLoading(true)
        api.stickers.create({ uri: image.base64 })
            .then(() => snackbar.success())
            .catch((error) => {
                console.error(error)
                snackbar.error()
            })
            .finally(() => {
                setIsLoading(false)
                api.stickers.all.mutate()
            })
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
