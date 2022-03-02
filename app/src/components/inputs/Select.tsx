import React from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Chip, Text, useTheme } from "react-native-paper"
import { ScrollView } from "react-native-gesture-handler"
import { Item } from '@meme-bros/client-lib'

function Select({
    items,
    label,
    value,
    onChange,
    style,
    getItemStyles,
    getItemTextStyles
}: {
    items: Item[],
    value: string,
    label: string,
    onChange: (value: string) => void,
    getItemStyles?: (item: Item) => ViewStyle,
    getItemTextStyles?: (item: Item) => TextStyle,
    style?: ViewStyle
}) {
    const styles = useStyles()

    const currentItem = items.find((item) => item.value === value)
    
    if (!currentItem) {
        throw new Error(`Unknown value: '${value}'`)
    }

    return (
        <View style={[style, styles.container]}>
            <Text style={styles.label}>{label}</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {items.map((item) => (
                    <Chip
                        key={item.value}
                        style={[
                            styles.item,
                            item.value === value && styles.selected,
                            getItemStyles?.(item)
                        ]}
                        textStyle={getItemTextStyles?.(item)}
                        onPress={() => onChange(item.value)}
                        mode="outlined"
                    >
                        {item.label}
                    </Chip>
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
            marginRight: 8
        },

        selected: {
            backgroundColor: "rgba(255, 255, 255, 0.25)"
        }
    }
}

export default Select
