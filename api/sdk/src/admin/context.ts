import React, { createContext, useContext, useMemo } from "react"
import { Config } from "./types"
import { AdminAPI } from "./api"

const AdminAPIContext = createContext<AdminAPI>(null as any)

export function useAdminAPI() {
    return useContext(AdminAPIContext)
}

export function AdminAPIProvider(props: React.PropsWithChildren<{
    config: Config
}>) {
    const api = useMemo(
        () => new AdminAPI(props.config),
        [props.config]
    )
    return React.createElement(
        AdminAPIContext.Provider,
        { value: api },
        props.children
    )
}
