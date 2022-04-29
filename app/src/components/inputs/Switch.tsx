import { View, StyleSheet } from "react-native"
import { Switch as SwitchLib, Text } from "react-native-paper"
import { OverwriteProps } from "tsdef"

function Switch({ value, onChange, label, ...rest }: OverwriteProps<
    React.ComponentProps<typeof SwitchLib>, 
    { onChange: (value: boolean) => void, label?: string }
>) {
    return (
        <View style={styles.container}>
            <SwitchLib value={value} onValueChange={onChange} {...rest}/>
            {label && <Text style={styles.label}>{label}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingVertical: 8
    },

    label: {
        marginTop: 3
    }
})

export default Switch
