import React from "react"
import { View } from "react-native"
import { Switch, Text } from "react-native-paper"
import { OverwriteProps } from "tsdef"

type Props = OverwriteProps<
    React.ComponentProps<typeof Switch>,
    { onChange: (value: boolean) => void }
> & {
    label: string
}

function BooleanInput({ label, onChange, ...rest }: Props) {
    return (
        <View>
            <Text>{label}</Text>
            <Switch onValueChange={onChange} {...rest}/>
        </View>
    )
}

export default BooleanInput
