import React from "react"
import { Container, Typography } from "@mui/material"
import UploadsList from "./UploadsList"

function UploadsPage() {
    return (
        <>
            <Typography variant="h3" mx={2} mt={4}>
                Uploads
            </Typography>

            <Container maxWidth="sm">
                <UploadsList/>
            </Container>
        </>
    )
}

export default UploadsPage
