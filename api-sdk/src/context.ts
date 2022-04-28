import React, { createContext, useContext, useMemo } from "react"
import { API } from "./api"
import { Config } from "./types"

const APIContext = createContext<API>(null as any)

export function useAPI() {
    return useContext(APIContext)
}

export function APIProvider(props: React.PropsWithChildren<{
    config: Config
}>) {
    const api = useMemo(
        () => new API(props.config),
        [props.config]
    )
    return React.createElement(
        APIContext.Provider,
        { value: api },
        props.children
    )
}
