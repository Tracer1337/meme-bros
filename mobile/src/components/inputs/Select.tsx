import React, { useRef, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Menu, Text, TouchableRipple, useTheme } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

export type Item = {
    label: string,
    value: string
}

function Select({ items, label, value, onChange }: {
    items: Item[],
    value: string,
    label: string,
    onChange: (value: string) => void
}) {
    const theme = useTheme()

    const inputRef = useRef<View | null>()

    const [isOpen, setIsOpen] = useState(false)
    
    const currentItem = items.find((item) => item.value === value)
    
    const handleSelect = (item: Item) => {
        onChange(item.value)
        setIsOpen(false)
    }
    
    if (!currentItem) {
        throw new Error(`Unknown value: '${value}'`)
    }

    const input = (
        <TouchableRipple
            style={[styles.touchable, {
                backgroundColor: theme.colors.surface,
                borderRadius: theme.roundness
            }]}
            onPress={() => setIsOpen(true)}
        >
            <View style={styles.container} ref={(ref) => inputRef.current = ref}>
                <View>
                    <Text style={styles.label}>{label}</Text>
                    <Text>{currentItem.label}</Text>
                </View>
                <Icon
                    name="menu-down"
                    color="#ffffff"
                    size={24}
                    style={styles.icon}
                />
            </View>
        </TouchableRipple>
    )

    return (
        <View>
            <Menu
                visible={isOpen}
                onDismiss={() => setIsOpen(false)}
                anchor={input}
            >
                {items.map((item) => (
                    <Menu.Item
                        key={item.value}
                        onPress={() => handleSelect(item)}
                        title={item.label}
                    />
                ))}
            </Menu>
        </View>
    )
}

const styles = StyleSheet.create({
    touchable: {
        height: 64,
        marginBottom: 16
    },

    container: {
        padding: 12,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 64
    },

    label: {
        fontSize: 12,
        marginBottom: 2
    },

    icon: {
        marginLeft: 16
    }
})

export default Select
