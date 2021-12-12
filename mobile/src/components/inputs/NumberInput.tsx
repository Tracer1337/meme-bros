import React from "react"
import { TextInput } from "react-native-paper"
import { OverwriteProps } from "tsdef"

function NumberInput({ value, onChange, ...rest }: OverwriteProps<
    React.ComponentProps<typeof TextInput>, 
    { value: number, onChange: (value: number) => void }
>) {
    return (
        <TextInput
            keyboardType="numeric"
            value={value.toString()}
            onChangeText={(value) => onChange(parseInt(value) || 0)}
            {...rest}
        />
    )
}

export default NumberInput
