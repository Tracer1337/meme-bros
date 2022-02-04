import React from "react"
import App from "@meme-bros/app"
import { Box, CircularProgress } from "@mui/material"
import { NativeModules, NativeModulesProvider } from "@meme-bros/client-lib"
import { useWasm } from "../lib/wasm"

const modules: NativeModules.ContextValue = {
    core: {
        render(canvas) {
            // @ts-ignore
            return window.render(JSON.stringify(canvas))
        }
    }
}

function RNApp({ width, height }: {
    width: number,
    height: number
}) {
    const { isLoading } = useWasm({ url: "/assets/core.wasm" })

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
            {isLoading ? <CircularProgress/> : (
                <NativeModulesProvider modules={modules}>
                    <App/>
                </NativeModulesProvider>
            )}
        </Box>
    )
}

export default RNApp
