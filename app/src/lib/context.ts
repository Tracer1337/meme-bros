import React, { createContext, useContext, useState } from "react"
import { DeepPartial } from "tsdef"
import { deepmerge, TemplateMeta } from "@meme-bros/client-lib"

export type AppContextValue = {
    set: (partial: DeepPartial<AppContextValue>) => void,
    templates: {
        isLoading: boolean,
        isSyncing: boolean,
        error: boolean,
        lists: {
            new: TemplateMeta[],
            top: TemplateMeta[],
            hot: TemplateMeta[]
        }
    }
}

const appContextDefaultValue: AppContextValue = {
    set: () => {},
    templates: {    
        isLoading: false,
        isSyncing: false,
        error: false,
        lists: {
            new: [],
            top: [],
            hot: []
        }
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
