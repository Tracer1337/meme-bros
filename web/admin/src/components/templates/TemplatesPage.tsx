import React from "react"
import { Outlet, Link } from "react-router-dom"
import { Button, Grid, Typography } from "@mui/material"
import {
    BridgeProvider,
    SharedContextProvider,
    useSharedContext
} from "@meme-bros/client-lib"
import TemplateList from "./TemplatesList"

function InnerTemplatesPage() {
    const context = useSharedContext()

    console.log(context)

    return (
        <Grid container height="calc(100vh - 64px)" px={2}>
            <Grid item xs={4} pt={4}>
                <Typography variant="h3">Templates</Typography>
                <Link to="create">
                    <Button>New</Button>
                </Link>
                <TemplateList/>
            </Grid>
            <Grid
                container
                item
                xs={8}
                justifyContent="center"
                alignItems="center"
            >
                <Outlet/>
            </Grid>
        </Grid>
    )
}

function TemplatesPage() {
    return (
        <BridgeProvider>
            <SharedContextProvider>
                <InnerTemplatesPage/>
            </SharedContextProvider>
        </BridgeProvider>
    )
}

export default TemplatesPage
