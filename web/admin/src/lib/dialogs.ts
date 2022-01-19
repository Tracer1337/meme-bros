import React, { createContext, useContext, useRef, useState } from "react"
import { useTheme } from "@mui/material"
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
    open: (() => {}) as any
}

export const DialogContext = createContext(dialogContextDefaultValue)

export function useDialogs() {
    return useContext(DialogContext)
}

export function DialogProvider({ children }: React.PropsWithChildren<{}>) {    
    const theme = useTheme()
    
    const value = useRef(dialogContextDefaultValue).current

    const [activeDialog, setActiveDialog] = useState<JSX.Element | null>(null)
    const [open, setOpen] = useState(false)

    value.open = (type, data) => new Promise((resolve) => {
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

    return React.createElement(
        DialogContext.Provider,
        { value },
        activeDialog && React.cloneElement(activeDialog, { open }),
        children
    )
}
