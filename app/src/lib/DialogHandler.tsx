import React, { createContext, useState } from "react"
import { useRef } from "react"
import { Portal } from "react-native-paper"
import { FirstArgument } from "tsdef"
import dialogs from "../components/dialogs"
import { useAppContext } from "./context"

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

const animationDuration = 300

export function DialogProvider({ children }: React.PropsWithChildren<{}>) {    
    const appContext = useAppContext()
    
    const context = useRef(dialogContextDefaultValue).current

    const [activeDialog, setActiveDialog] = useState<JSX.Element | null>(null)
    const [visible, setVisible] = useState(false)

    context.open = (type, data) => new Promise((resolve) => {
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
                <Portal>
                    {React.cloneElement(
                        activeDialog,
                        { visible, appContext }
                    )}
                </Portal>
            )}
            {children}
        </DialogContext.Provider>
    )
}
