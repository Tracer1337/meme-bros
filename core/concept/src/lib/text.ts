import { CanvasRenderingContext2D, createCanvas } from "canvas"

// https://github.com/fogleman/gg/blob/0403632d5b905943a1c2a5b2763aaecd568467ec/wrap.go#L28
export function wrap(
    context: CanvasRenderingContext2D,
    text: string,
    width: number
) {
    const result: string[] = []
    text.split("\n").forEach((line) => {
        const fields = line.split(" ").map((w) => w + " ")
        if (fields.length % 2 === 1) {
            fields.push("")
        }
        let x = ""
        for (let i = 0; i < fields.length; i += 2) {
            const w = context.measureText(x + fields[i]).width
            if (w > width) {
                if (x === "") {
                    result.push(fields[i])
                    continue
                } else {
                    result.push(x)
                    x = ""
                }
            }
            x += fields[i] + fields[i + 1]
        }
        if (x !== "") {
            result.push(x)
        }
    })
    return result.map((s) => s.trim()).join("\n")
}

export function measureText(
    context: CanvasRenderingContext2D,
    text: string
) {
    const metrics = context.measureText(text)
    return {
        width: metrics.width,
        // @ts-ignore
        height: metrics.emHeightAscent + metrics.emHeightDescent
    }
}

export function fittext({ text, font, width, height }: {
    text: string,
    font: string,
    width: number,
    height: number
}) {
    let low = 1, high = height
    const dc = createCanvas(width, height).getContext("2d")
    let fontSize = low
    while (low <= high) {
        const mid = Math.floor((high + low) / 2)
        dc.font = `${mid}px ${font}`
        const wrapped = wrap(dc, text, width)
        const m = measureText(dc, wrapped)
        if (m.width <= width && m.height <= height) {
            fontSize = mid
            low = mid + 1
        } else {
            high = mid - 1
        }
    }
    return {
        fontSize,
        text: wrap(dc, text, width)
    }
}
