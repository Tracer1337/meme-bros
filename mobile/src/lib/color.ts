import convert from "color-convert"
import { RGB } from "color-convert/conversions"
import { Color } from "../types"

export function toRGBAString(color: Color) {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`
}

export function toRGB(color: Color): RGB {
    return [color[0], color[1], color[2]]
}

export function toHex(color: Color) {
    return `#${convert.rgb.hex(toRGB(color)).toLowerCase()}`
}

export function fromHex(hex: string): Color {
    const rgb = convert.hex.rgb(hex)
    return [...rgb, 255]
}
