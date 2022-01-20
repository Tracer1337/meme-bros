import React, { createContext, useContext, useRef, useState } from "react"
import { Snackbar, Alert, AlertColor } from "@mui/material"

type SnackbarContextValue = {
    [k in AlertColor]: (message?: string) => void
}

const contextDefaultValue: SnackbarContextValue = {
    success: () => {},
    info: () => {},
    warning: () => {},
    error: () => {}
}

const SnackbarContext = createContext(contextDefaultValue)

export function useSnackbar() {
    return useContext(SnackbarContext)
}

export function SnackbarProvider({
    children
}: React.PropsWithChildren<{}>) {
    const value = useRef(contextDefaultValue).current

    const [snackbar, setSnackbar] = useState<JSX.Element | null>(null)

    const openSnackbar = (message: string, severity: AlertColor) => {
        const onClose = () => setSnackbar(null)
        setSnackbar(
            React.createElement(
                Snackbar,
                {
                    open: true,
                    onClose,
                    autoHideDuration: 6000
                },
                React.createElement(
                    Alert,
                    {
                        severity,
                        onClose,
                        sx: { width: "100%" }
                    },
                    message
                )
            )
        )
    }
    
    value.success = (message = "Success") => openSnackbar(message, "success")
    value.info = (message = "Info") => openSnackbar(message, "info")
    value.warning = (message = "Warning") => openSnackbar(message, "warning")
    value.error = (message = "Error") => openSnackbar(message, "error")

    return React.createElement(
        SnackbarContext.Provider,
        { value },
        children,
        snackbar
    )
}
