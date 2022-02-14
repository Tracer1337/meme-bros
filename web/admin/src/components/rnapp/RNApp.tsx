import React from "react"
import App from "@meme-bros/app"
import { Box } from "@mui/material"
import { Modules, ModulesProvider } from "@meme-bros/client-lib"
import { useCoreModule } from "./modules/core"
import { useTemplatesModule } from "./modules/templates"
import storageModule from "./modules/storage"
import canvasModule from "./modules/canvas"
import viewModule from "./modules/view"
import permissionsModule from "./modules/permissions"

function RNApp({ width, height }: {
    width: number,
    height: number
}) {
    const modules: Modules.ContextValue = {
        core: useCoreModule(),
        templates: useTemplatesModule(),
        storage: storageModule,
        canvas: canvasModule,
        view: viewModule,
        permissions: permissionsModule,
        social: {}
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
