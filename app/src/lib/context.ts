import React, { createContext, useContext, useState } from "react"
import { DeepPartial } from "tsdef"
import { deepmerge } from "@meme-bros/shared"

export type AppContextValue = {
    set: (partial: DeepPartial<AppContextValue>) => void,
    templates: {
        isSyncing: boolean
    }
}

const appContextDefaultValue: AppContextValue = {
    set: () => {},
    templates: {
        isSyncing: false
    }
}

export const AppContext = createContext(appContextDefaultValue)

export function useAppContext() {
    return useContext(AppContext)
}

export function AppContextProvider({
    children
}: React.PropsWithChildren<{}>) {
    const [value, setValue] = useState(appContextDefaultValue)

    value.set = (partial) => {
        setValue(deepmerge(value, partial) as AppContextValue)
    }

    return React.createElement(
        AppContext.Provider,
        { value },
        children
    )
}
