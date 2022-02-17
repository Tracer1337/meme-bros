import { setDOMListeners, SharedContext } from "@meme-bros/client-lib"

function stopPropagation(event: Event) {
    event.stopPropagation()
}

type Point = { x: number, y: number }
type Rect = {
    x: number,
    y: number,
    width: number,
    height: number
}

function findRect(path: Point[]): Rect {
    let minX = Infinity, minY = Infinity,
        maxX = -Infinity, maxY = -Infinity
    path.forEach((point) => {
        if (point.x < minX) minX = point.x
        if (point.y < minY) minY = point.y
        if (point.x > maxX) maxX = point.x
        if (point.y > maxY) maxY = point.y
    })
    const width = maxX - minX
    const height = maxY - minY
    return { x: minX, y: minY, width, height }
}

function extractRect(
    origin: CanvasRenderingContext2D,
    rect: Rect
) {
    const canvas = document.createElement("canvas")
    canvas.width = rect.width
    canvas.height = rect.height

    const context = canvas.getContext("2d")

    if (!context) {
        throw new Error("Could not obtain drawing context")
    }
    
    const imageData = origin.getImageData(
        rect.x,
        rect.y,
        rect.width,
        rect.height
    )
    context.putImageData(imageData, 0, 0)

    return context
}

export type DrawingResult = {
    uri: string,
    rect: Rect
}

export function setupDrawingCanvas({
    canvas,
    config,
    onDrawingDone
}: {
    canvas: HTMLCanvasElement,
    config: SharedContext.ContextValue["drawing"],
    onDrawingDone: (result: DrawingResult) => void
}) {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    const context = canvas.getContext("2d")
    const offset = canvas.getBoundingClientRect()
    const path: Point[] = []
    let isDrawing = false

    if (!context) {
        throw new Error("Could not obtain drawing context")
    }

    const draw = () => {
        clear()
        drawPath(path)
    }

    const clear = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
    }

    const drawPath = (path: Point[]) => {
        if (path.length === 0) {
            return
        }

        context.fillStyle = config.color
        context.strokeStyle = config.color
        context.lineWidth = config.width
        context.lineCap = "round"

        context.beginPath()
        context.moveTo(path[0].x, path[0].y)
        context.arc(0, 0, 2, 0, Math.PI * 2, false)
        context.fill()
        
        context.beginPath()
        context.moveTo(path[0].x, path[0].y)
        path.forEach((point) => {
            context.lineTo(point.x, point.y)
        })
        context.stroke()
    }

    const handleDrawStart = (point: Point) => {
        isDrawing = true
        path.push({
            x: point.x - offset.x,
            y: point.y - offset.y
        })
        draw()
    }

    const handleDrawPoint = (point: Point) => {
        if (isDrawing) {
            path.push({
                x: point.x - offset.x,
                y: point.y - offset.y
            })
            draw()
        }
    }

    const handleDrawEnd = () => {
        isDrawing = false

        const rect = findRect(path)
        rect.x -= config.width / 2
        rect.y -= config.width / 2
        rect.width += config.width
        rect.height += config.width

        const cropped = extractRect(context, rect)

        onDrawingDone({
            uri: cropped.canvas.toDataURL(),
            rect
        })
    }

    const handleTouchStart = (event: TouchEvent) => {
        handleDrawStart({
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        })
    }
    
    const handleTouchMove = (event: TouchEvent) => {
        event.preventDefault()
        handleDrawStart({
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        })
    }

    draw()

    return setDOMListeners(canvas, [
        ["click", stopPropagation],
        ["touchstart", stopPropagation],

        ["mousedown", handleDrawStart],
        ["mousemove", handleDrawPoint],
        ["mouseup", handleDrawEnd],

        ["touchstart", handleTouchStart],
        ["touchmove", handleTouchMove],
        ["touchend", handleDrawEnd],
        ["touchcancel", handleDrawEnd]
    ])
}
