import React, { createContext, useContext, useRef, useState } from "react"
import { Snackbar } from "react-native-paper"

type SnackbarContextValue = {
    open: (message: string) => void
}

const contextDefaultValue: SnackbarContextValue = {} as any

const SnackbarContext = createContext(contextDefaultValue)

export function useSnackbar() {
    return useContext(SnackbarContext)
}

export function SnackbarProvider({
    children
}: React.PropsWithChildren<{}>) {
    const value = useRef(contextDefaultValue).current

    const [snackbar, setSnackbar] = useState<JSX.Element | null>(null)

    value.open = (message: string) => {
        const onDismiss = () => setSnackbar(null)
        setSnackbar(
            React.createElement(
                Snackbar,
                {
                    visible: true,
                    onDismiss,
                    action: {
                        label: "Close",
                        action: onDismiss
                    }
                },
                message
            )
        )
    }

    return React.createElement(
        SnackbarContext.Provider,
        { value },
        children,
        snackbar
    )
}
