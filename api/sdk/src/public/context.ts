import React, { createContext, useContext, useMemo } from "react"
import { PublicAPI } from "./api"
import { Config } from "./types"

const PublicAPIContext = createContext<PublicAPI>(null as any)

export function usePublicAPI() {
    return useContext(PublicAPIContext)
}

export function PublicAPIProvider(props: React.PropsWithChildren<{
    config: Config
}>) {
    const api = useMemo(
        () => new PublicAPI(props.config),
        [props.config]
    )
    return React.createElement(
        PublicAPIContext.Provider,
        { value: api },
        props.children
    )
}
