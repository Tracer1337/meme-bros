import React from "react"
import App from "@meme-bros/app"
import { Box } from "@mui/material"
import { Modules, ModulesProvider } from "@meme-bros/client-lib"
import { Workers } from "../lib/workers"

function RNApp({ width, height }: {
    width: number,
    height: number
}) {
    const modules: Modules.ContextValue = {
        core: {
            render: Workers.render
        }
    }

    return (
        <Box
            id="app"
            sx={{
                width,
                height,
                "& > div": {
                    width: "100%",
                    height: "100%"
                }
            }}
        >
            <ModulesProvider modules={modules}>
                <App/>
            </ModulesProvider>
        </Box>
    )
}

export default RNApp
