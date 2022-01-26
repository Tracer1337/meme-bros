import React from "react"
import App from "@meme-bros/app"
import { Box } from "@mui/material"

function RNApp({ width, height }: {
    width: number,
    height: number
}) {
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
            <App/>
        </Box>
    )
}

export default RNApp
