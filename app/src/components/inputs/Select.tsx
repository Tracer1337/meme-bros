import React from "react"
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native"
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
        <View style={{
            ...style,
            ...styles.container
        }}>
            <Text style={styles.label}>{label}</Text>
            <ScrollView>
                {items.map((item) => (
                    <Chip
                        style={getItemStyles?.(item)}
                        textStyle={getItemTextStyles?.(item)}
                        onPress={() => onChange(item.value)}
                        selected={item.value === value}
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

    return StyleSheet.create({
        container: {
            backgroundColor: theme.colors.background
        },
        
        label: {
            marginBottom: 8
        }
    })
}

export default Select
