import React, { createContext, useContext, useState } from "react"
import { DeepPartial } from "tsdef"
import { deepmerge, TemplateMeta } from "@meme-bros/client-lib"

export type AppContextValue = {
    set: (partial: DeepPartial<AppContextValue>) => void,
    sync: {
        isLoading: boolean,
        error: boolean
    },
    templates: {
        isLoading: boolean,
        error: boolean,
        lists: {
            new: TemplateMeta[],
            top: TemplateMeta[],
            hot: TemplateMeta[]
        }
    },
    stickers: {
        isLoading: boolean,
        error: boolean,
        list: string[]
    }
}

const appContextDefaultValue: AppContextValue = {
    set: () => {},
    sync: {
        isLoading: false,
        error: false
    },
    templates: {    
        isLoading: false,
        error: false,
        lists: {
            new: [],
            top: [],
            hot: []
        }
    },
    stickers: {
        isLoading: false,
        error: false,
        list: []
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
