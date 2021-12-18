import { useTheme } from "@mui/material"
import React, { createContext, useRef, useState } from "react"
import { FirstArgument } from "tsdef"
import dialogs from "../components/dialogs"

export type DialogProps<I, O = void> = {
    data: I,
    close: (data: O extends void ? I : O) => void,
    open: boolean
}

type DialogContextValue = {
    open: <T extends keyof typeof dialogs>(
        type: T,
        data: React.ComponentProps<typeof dialogs[T]>["data"]
    ) => Promise<FirstArgument<React.ComponentProps<typeof dialogs[T]>["close"]>>
}

const dialogContextDefaultValue: DialogContextValue = {
    open: (() => {
        console.warn("Not implemented")
    }) as any
}

export const DialogContext = createContext(dialogContextDefaultValue)

export function DialogProvider({ children }: React.PropsWithChildren<{}>) {    
    const theme = useTheme()
    
    const context = useRef(dialogContextDefaultValue).current

    const [activeDialog, setActiveDialog] = useState<JSX.Element | null>(null)
    const [open, setOpen] = useState(false)

    context.open = (type, data) => new Promise((resolve) => {
        setActiveDialog(React.createElement(dialogs[type] as any, {
            close: (result: any) => {
                setOpen(false)
                resolve(result)
                setTimeout(() => setActiveDialog(null), theme.transitions.duration.standard)
            },
            data
        }))
        requestAnimationFrame(() => setOpen(true))
    })

    return (
        <DialogContext.Provider value={context}>
            {activeDialog && React.cloneElement(activeDialog, { open })}
            {children}
        </DialogContext.Provider>
    )
}