import React from "react"
import Select, { Item } from "react-native-picker-select"

const colors: Item[] = [
    { label: "White", value: "#ffffff" },
    { label: "Black", value: "#000000" },
    { label: "Green", value: "#2ecc71" },
    { label: "Red", value: "#e74c3c" },
    { label: "Blue", value: "#3498db" },
    { label: "Yellow", value: "#f1c40f" },
    { label: "Purple", value: "#9b59b6" }
]

function ColorPicker({ label, value, onChange }: {
    label: string,
    value: string,
    onChange: (value: string) => void
}) {
    console.log({ value })

    return (        
        <Select
            placeholder={{ label, value: "transparent" }}
            value={value}
            items={colors}
            onValueChange={onChange}
        />
    )
}

export default ColorPicker
