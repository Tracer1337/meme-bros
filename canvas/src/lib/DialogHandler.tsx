import React, { createContext, useRef } from "react"

type DialogContextValue = {
    openDialog: <T extends any>(
        type: T,
        data: any
    ) => Promise<any>
}

const dialogContextDefaultValue: DialogContextValue = {
    openDialog: (() => {
        console.warn("Not implemented")
    }) as any
}

export const DialogContext = createContext(dialogContextDefaultValue)

export function DialogProvider({ children }: React.PropsWithChildren<{}>) {    
    const context = useRef(dialogContextDefaultValue).current

    return (
        <DialogContext.Provider value={context}>
            {children}
        </DialogContext.Provider>
    )
}
