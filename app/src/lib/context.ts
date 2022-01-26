import React, { createContext, useContext, useState } from "react"
import { DeepPartial } from "tsdef"
import { deepmerge } from "@meme-bros/client-lib"

export type AppContextValue = {
    set: (partial: DeepPartial<AppContextValue>) => void,
    templates: {
        isSyncing: boolean,
        error: boolean
    }
}

const appContextDefaultValue: AppContextValue = {
    set: () => {},
    templates: {
        isSyncing: false,
        error: false
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
        setValue((value) => deepmerge(value, partial) as AppContextValue)
    }

    return React.createElement(
        AppContext.Provider,
        { value },
        children
    )
}
