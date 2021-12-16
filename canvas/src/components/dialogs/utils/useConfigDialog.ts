import React, { useState } from "react"
import { TextField } from "@mui/material"
import { CanvasElement, PickElement } from "../../../types"
import Switch from "../../inputs/Switch"

type GetPropsFunction<T extends CanvasElement["type"], C extends React.ComponentType<any>> =
    (label: string, key: keyof PickElement<T>["data"]) => React.ComponentProps<C>

export type ConfigDialogHook<T extends CanvasElement["type"]> = {
    data: PickElement<T>["data"],
    getTextFieldProps: GetPropsFunction<T, typeof TextField>,
    getBooleanFieldProps: GetPropsFunction<T, typeof Switch>,
}

export function useConfigDialog<T extends CanvasElement["type"]>(
    element: PickElement<T>
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
