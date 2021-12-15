import * as CSS from "csstype"

function getNewFontsize(div: HTMLDivElement, text: string) {
    const span = document.createElement("span")
    span.textContent = text
    
    div.appendChild(span)

    let low = 1
    let high = window.innerHeight
    
    // Binary search for highest best fit
    let fontSize = low
    while (low <= high) {
        const mid = Math.floor((high + low) / 2)
        span.style.fontSize = mid + "px"
        const rect = span.getBoundingClientRect()
        if (rect.width <= div.clientWidth && rect.height <= div.clientHeight) {
            fontSize = mid
            low = mid + 1
        } else {
            high = mid - 1
        }
    }

    return fontSize
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
        position: "absolute",
        width: width + "px",
        height: height + "px",
        whiteSpace: "pre-wrap",
        ...styles
    })

    document.body.appendChild(div)

    const fontSize = getNewFontsize(div, text)

    document.body.removeChild(div)

    return fontSize
}
