import React, { createContext, useContext } from "react"
import * as Core from "@meme-bros/core-types"
import * as API from "@meme-bros/api-sdk"
import { Editor } from "@meme-bros/shared"
import { TemplateMeta } from "./templates"
import { Permissions } from "./permissions"

export namespace Modules {
    export type CoreModule = {
        render?: (canvas: Core.Canvas) => Promise<string>
    }

    export type SyncModule = {
        syncResources?: () => Promise<void>
    }

    export type TemplatesModule = {
        loadTemplates: () => Promise<{
            new: TemplateMeta[],
            top: TemplateMeta[],
            hot: TemplateMeta[]
        }>,
        getPreviewURI: (template: API.Template) => string,
        getCanvas: (template: API.Template) => Promise<Editor.Canvas>
    }

    export type StorageModule = {
        saveImage: (base64: string) => Promise<void>,
        importImage: () => Promise<{
            base64: string,
            width: number,
            height: number
        } | undefined>,
        resolveAssetSource: (uri: number | string) => Promise<{
            uri: string,
            width: number,
            height: number
        } | undefined>
    }

    export type CanvasModule = {
        uri: string
    }

    export type ViewModule = {
        useDimensions: () => {
            width: number,
            height: number
        }
    }

    export type PermissionsModule = {
        request: (permission: Permissions) => Promise<boolean>
    }

    export type SocialModule = {
        share?: (args: { uri: string }) => Promise<void>
    }

    export type ContextValue = {
        core: CoreModule,
        sync: SyncModule,
        templates: TemplatesModule,
        storage: StorageModule,
        canvas: CanvasModule,
        view: ViewModule,
        permissions: PermissionsModule,
        social: SocialModule
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
