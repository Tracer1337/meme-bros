export type Item = {
    label: string,
    value: any
}

export const colors: Item[] = [
    { label: "Transparent", value: "transparent" },
    { label: "White", value: "#ffffff" },
    { label: "Black", value: "#000000" },
    { label: "Green", value: "#2ecc71" },
    { label: "Red", value: "#e74c3c" },
    { label: "Blue", value: "#3498db" },
    { label: "Yellow", value: "#f1c40f" },
    { label: "Purple", value: "#9b59b6" }
]

export const fontFamilies: Item[] = [
    { label: "Impact", value: "Impact" },
    { label: "Arial", value: "Arial" },
    { label: "Comic Sans", value: "Comic-Sans" }
]

export const fontWeights: Item[] = [
    { label: "Normal", value: "normal" },
    { label: "Bold", value: "bold" }
]

export const shapeVariants: Item[] = [
    { label: "Rectangle", value: "rect" },
    { label: "Circle", value: "ellipse" }
]

export const textAlign: Item[] = [
    { label: "Left", value: "left" },
    { label: "Right", value: "right" },
    { label: "Center", value: "center" }
]

export const verticalAlign: Item[] = [
    { label: "Top", value: "top" },
    { label: "Bottom", value: "bottom" },
    { label: "Center", value: "center" }
]
