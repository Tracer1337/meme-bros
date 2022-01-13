import React from "react"
import { Grid, Paper, Typography } from "@mui/material"
import RNApp from "../RNApp"
import TemplateList from "./TemplatesList"
import { BridgeProvider, SharedContextProvider, useSharedContext } from "@meme-bros/shared"
import { API } from "../../lib/api"

function InnerTemplatesPage() {
    const context = useSharedContext()

    console.log(context)

    const handleTemplateClick = (template: API.Template) => {
        context.events.emit("template.load", template.canvas)
    }

    return (
        <Grid container height="calc(100vh - 64px)" px={2}>
            <Grid item xs pt={4}>
                <Typography variant="h3">Templates</Typography>
                <TemplateList onClick={handleTemplateClick}/>
            </Grid>
            <Grid
                container
                item
                xs
                justifyContent="center"
                alignItems="center"
            >
                <Paper variant="outlined">
                    <RNApp
                        width={window.innerWidth * 0.4}
                        height={window.innerHeight * 0.9}
                    />
                </Paper>
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
