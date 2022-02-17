import { setDOMListeners, SharedContext } from "@meme-bros/client-lib"

function stopPropagation(event: Event) {
    event.stopPropagation()
}

type Point = { x: number, y: number }

export function setupDrawingCanvas({
    canvas,
    config,
    onDrawingDone
}: {
    canvas: HTMLCanvasElement,
    config: SharedContext.ContextValue["drawing"],
    onDrawingDone: () => void
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
        onDrawingDone()
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
