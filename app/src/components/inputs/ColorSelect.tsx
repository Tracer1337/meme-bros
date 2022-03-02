import React, { useMemo } from "react"
import { TouchableOpacity, View, ViewStyle } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { Text, useTheme } from "react-native-paper"
import { colors, extraColors } from "@meme-bros/client-lib"

function ColorSelect({
    value,
    onChange,
    label,
    style,
    includeTransparent
}: {
    value: string,
    onChange: (newValue: string) => void,
    label: string,
    style?: ViewStyle,
    includeTransparent?: boolean
}) {
    const styles = useStyles()

    const items = useMemo(() => {
        const items = [...colors]
        if (includeTransparent) {
            items.unshift(extraColors.transparent)
        }
        return items
    }, [includeTransparent])

    return (
        <View style={[style, styles.container]}>
            <Text style={styles.label}>{label}</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flex: 1 }}
            >
                {items.map((item) => (
                    <TouchableOpacity
                        onPress={() => onChange(item.value)}
                        style={{
                            ...styles.dot,
                            ...(item.value === value && styles.selected),
                            backgroundColor: item.value
                        }}
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
            flex: 1,
            backgroundColor: theme.colors.background,
            padding: 12,
            borderRadius: theme.roundness
        },

        label: {
            marginBottom: 8,
            fontSize: 12
        },

        dot: {
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.onSurface,
            marginRight: 8
        },

        selected: {
            borderWidth: 5
        }
    }
}

export default ColorSelect
