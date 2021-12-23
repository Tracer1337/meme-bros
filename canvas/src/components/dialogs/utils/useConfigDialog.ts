import React, { useState } from "react"
import { TextField } from "@mui/material"
import * as Core from "@meme-bros/core"
import Switch from "../../inputs/Switch"

type GetPropsFunction<T extends Core.CanvasElement["type"], C extends React.ComponentType<any>> =
    (label: string, key: keyof Core.PickElement<T>["data"]) => React.ComponentProps<C>

export type ConfigDialogHook<T extends Core.CanvasElement["type"]> = {
    data: Core.PickElement<T>["data"],
    getTextFieldProps: GetPropsFunction<T, typeof TextField>,
    getBooleanFieldProps: GetPropsFunction<T, typeof Switch>,
}

export function useConfigDialog<T extends Core.CanvasElement["type"]>(
    element: Core.PickElement<T>
): ConfigDialogHook<T> {
    const [data, setData] = useState(element.data)

    const getTextFieldProps = (
        label: string,
        key: keyof typeof data
    ): React.ComponentProps<typeof TextField> => ({
        label,
        fullWidth: true,
        margin: "dense",
        variant: "standard",
        value: data[key],
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            setData({ ...data, [key]: event.target.value })
        }
    })

    const getBooleanFieldProps = (
        label: string,
        key: keyof typeof data
    ): React.ComponentProps<typeof Switch> => ({
        label,
        checked: data[key] as boolean,
        sx: { marginTop: 1, marginBottom: 0.5 },
        onChange: (_, value) => {
            setData({ ...data, [key]: value })
        }
    })

    return { data, getTextFieldProps, getBooleanFieldProps } as any
}
