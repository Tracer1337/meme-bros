import React from "react"
import { TouchableOpacity, View, ViewStyle } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { Text, useTheme } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { colors } from "@meme-bros/client-lib"

function ColorSelect({
    value,
    onChange,
    label,
    optional,
    style
}: {
    value: string,
    onChange: (newValue: string) => void,
    label: string,
    optional?: boolean
    style?: ViewStyle,
}) {
    const theme = useTheme()
    
    const styles = useStyles()

    return (
        <View style={[style, styles.container]}>
            <Text style={styles.label}>{label}</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {optional && (
                    <TouchableOpacity
                        onPress={() => onChange("transparent")}
                        style={styles.item}
                    >
                        <Icon
                            name="cancel"
                            size={24}
                            color={theme.colors.onSurface}
                        />
                    </TouchableOpacity>
                )}
                {colors.map((item) => (
                    <TouchableOpacity
                        key={item.value}
                        onPress={() => onChange(item.value)}
                        style={[
                            styles.item,
                            styles.dot,
                            item.value === value && styles.selected,
                            { backgroundColor: item.value }
                        ]}
                    >
                        <View/>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

function useStyles() {
    const theme = useTheme()
    
    return {
        container: {
            backgroundColor: theme.colors.background,
            padding: 12,
            borderRadius: theme.roundness
        },

        label: {
            marginBottom: 8,
            fontSize: 12
        },

        item: {
            width: 24,
            height: 24,
            marginRight: 8
        },

        dot: {
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.onSurface
        },

        selected: {
            borderWidth: 5
        }
    }
}

export default ColorSelect
