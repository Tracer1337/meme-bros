import { Color } from "../types"

export function toRGBAString(color: Color) {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`
}
