import React, { createContext, useState } from "react"
import { Portal } from "react-native-paper"
import { FirstArgument } from "tsdef"
import dialogs from "../components/dialogs"

type DialogContextValue = {
    openDialog: <T extends keyof typeof dialogs>(
        type: T,
        data: React.ComponentProps<typeof dialogs[T]>["data"]
    ) => Promise<FirstArgument<React.ComponentProps<typeof dialogs[T]>["close"]>>
}

const dialogContextDefaultValue: DialogContextValue = {
    openDialog: (() => {
        console.warn("Not implemented")
    }) as any
}

export const DialogContext = createContext(dialogContextDefaultValue)

const animationDuration = 300

export function DialogProvider({ children }: React.PropsWithChildren<{}>) {    
    const [context, setContext] = useState(dialogContextDefaultValue)
    const [activeDialog, setActiveDialog] = useState<JSX.Element | null>(null)
    const [visible, setVisible] = useState(false)

    context.openDialog = (type, data) => new Promise((resolve) => {
        setActiveDialog(React.createElement(dialogs[type] as any, {
            close: (result: any) => {
                setVisible(false)
                // @ts-ignore
                resolve(result)
                setTimeout(() => setActiveDialog(null), animationDuration)
            },
            data
        }))
        requestAnimationFrame(() => setVisible(true))
    })

    return (
        <DialogContext.Provider value={context}>
            {activeDialog && (
                <Portal>{React.cloneElement(activeDialog, { visible })}</Portal>
            )}
            {children}
        </DialogContext.Provider>
    )
}
