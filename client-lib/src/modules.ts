import React, { createContext, useContext } from "react"
import * as Core from "@meme-bros/core-types"

export namespace Modules {
    export type CoreModule = {
        render: (canvas: Core.Canvas) => Promise<string>
    }

    export type ContextValue = Partial<{
        core: Partial<CoreModule>
    }>
}

const ModulesContext = createContext<Modules.ContextValue>({})

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
