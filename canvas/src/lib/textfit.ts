import textfitLib from "textfit"
import * as CSS from "csstype"

function getNewFontsize(div: HTMLDivElement) {
    textfitLib(div, {
        multiLine: true,
        minFontSize: 1,
        maxFontSize: window.innerHeight
    })
    const span = div.querySelector("span")
    if (!span) {
        throw new Error("Could not find span element")
    }
    const fontSize = getComputedStyle(span).fontSize
    return parseInt(fontSize)
}

export function textfit({ width, height, text, styles }: {
    width: number,
    height: number,
    text: string,
    styles: CSS.Properties
}) {
    width = Math.floor(width)
    height = Math.floor(height)

    if (width <= 0 || height <= 0) {
        return 0
    }

    const div = document.createElement("div")

    Object.assign(div.style, {
        ...styles,
        position: "absolute",
        width: width + "px",
        height: height + "px",
    })

    div.textContent = text

    document.body.appendChild(div)

    const fontSize = getNewFontsize(div)

    document.body.removeChild(div)

    return fontSize
}
