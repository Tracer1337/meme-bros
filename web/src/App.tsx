import "./style.css"
import RNApp from "@meme-bros/app"
import { Modules, ModulesProvider } from "@meme-bros/client-lib"
import { useCoreModule } from "./modules/core"
import { useTemplatesModule } from "./modules/templates"
import { useStickersModule } from "./modules/stickers"
import storageModule from "./modules/storage"
import canvasModule from "./modules/canvas"
import viewModule from "./modules/view"
import permissionsModule from "./modules/permissions"

function App({ width, height }: {
    width: number,
    height: number
}) {
    const modules: Modules.ContextValue = {
        core: useCoreModule(),
        templates: useTemplatesModule(),
        stickers: useStickersModule(),
        storage: storageModule,
        canvas: canvasModule,
        view: viewModule,
        permissions: permissionsModule,
        social: {},
        sync: {}
    }

    return (
        <div
            id="app"
            style={{
                width: `${width}px`,
                height: `${height}px`
            }}
        >
            <ModulesProvider modules={modules}>
                <RNApp/>
            </ModulesProvider>
        </div>
    )
}

export default App
