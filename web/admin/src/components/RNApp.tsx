import React from "react"
import App from "@meme-bros/app"
import { Box } from "@mui/material"
import { Modules, ModulesProvider } from "@meme-bros/client-lib"
import { useWasm } from "../lib/wasm"

function RNApp({ width, height }: {
    width: number,
    height: number
}) {
    const { isLoading } = useWasm({ url: "/assets/core.wasm" })

    const modules: Modules.ContextValue = {
        core: {
            render: isLoading ? undefined : (canvas) => {
                return window.render?.(JSON.stringify(canvas))
            }
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
