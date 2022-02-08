import React, { createContext, useContext } from "react"
import * as Core from "@meme-bros/core-types"
import * as API from "@meme-bros/api-sdk"
import { Editor } from "@meme-bros/shared"
import { TemplateMeta } from "./templates"

export namespace Modules {
    export type CoreModule = {
        render?: (canvas: Core.Canvas) => Promise<string>
    }

    export type TemplatesModule = {
        loadTemplates: (callbacks?: {
            onStart?: () => void,
            onEnd?: () => void,
            onError?: (error: any) => void
        }) => Promise<{
            new: TemplateMeta[],
            top: TemplateMeta[],
            hot: TemplateMeta[]
        }>,
        syncTemplates: () => Promise<void>,
        getPreviewURI: (template: API.Template) => string,
        getCanvas: (template: API.Template) => Editor.Canvas
    }

    export type StorageModule = {
        saveImage: (base64: string) => Promise<void>,
        importImage: () => Promise<string>,
        resolveAssetSource: (uri: string) => {}
    }

    export type CanvasModule = {
        uri: string
    }

    export type ViewModule = {
        useDimensions: () => {}
    }

    export type ContextValue = {
        core: CoreModule,
        templates: TemplatesModule,
        storage: StorageModule,
        canvas: CanvasModule,
        view: ViewModule
    }
}

const defaultValue: Modules.ContextValue = {} as any

const ModulesContext = createContext(defaultValue)

export function useModule<
    K extends keyof Modules.ContextValue
>(key: K): Modules.ContextValue[K] {
    return useContext(ModulesContext)[key]
}

export function ModulesProvider({
    children,
    modules
}: React.PropsWithChildren<{
    modules: Modules.ContextValue
}>) {
    return React.createElement(
        ModulesContext.Provider,
        { value: modules },
        children
    )
}
