import React from "react"
import { Typography } from "@mui/material"
import UploadsList from "./UploadsList"

function UploadsPage() {
    return (
        <>
            <Typography variant="h3" mx={2} mt={4}>
                Uploads
            </Typography>

            <UploadsList/>
        </>
    )
}

export default UploadsPage
