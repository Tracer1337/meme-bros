export type Item = {
    label: string,
    value: any
}

export const colors: Item[] = [
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
    { label: "Center", value: "center" },
    { label: "Right", value: "right" }
]

export const verticalAlign: Item[] = [
    { label: "Top", value: "top" },
    { label: "Center", value: "center" },
    { label: "Bottom", value: "bottom" }
]
