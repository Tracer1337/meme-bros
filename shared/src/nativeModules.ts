import React, { createContext, useContext } from "react"
import * as Core from "@meme-bros/core"

export namespace NativeModules {
    export type CoreModule = {
        render(canvas: Core.Canvas): Promise<string>
    }

    export type ContextValue = {
        core: CoreModule
    }
}

const defaultContextValue: NativeModules.ContextValue = {
    core: {
        render: () => Promise.resolve("")
    }
}

const NativeModulesContext = createContext<NativeModules.ContextValue>(
    defaultContextValue
)

export function useNativeModule<
    K extends keyof NativeModules.ContextValue
>(key: K): NativeModules.ContextValue[K] {
    return useContext(NativeModulesContext)[key]
}

export function NativeModulesProvider({
    children,
    modules
}: React.PropsWithChildren<{
    modules: NativeModules.ContextValue
}>) {
    return React.createElement(
        NativeModulesContext.Provider,
        { value: modules },
        children
    )
}
