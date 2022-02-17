import { setDOMListeners, SharedContext } from "@meme-bros/client-lib"

function stopPropagation(event: Event) {
    event.stopPropagation()
}

type Path = { x: number, y: number }[]

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
    const path: Path = []
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

    const drawPath = (path: Path) => {
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

    const handleMouseDown = (event: MouseEvent) => {
        isDrawing = true
        path.push({
            x: event.x - offset.x,
            y: event.y - offset.y
        })
        draw()
    }

    const handleMouseMove = (event: MouseEvent) => {
        if (!isDrawing) {
            return
        }
        path.push({
            x: event.x - offset.x,
            y: event.y - offset.y
        })
        draw()
    }

    const handleMouseUp = () => {
        isDrawing = false
        onDrawingDone()
    }

    draw()

    return setDOMListeners(canvas, [
        ["click", stopPropagation],
        ["touchstart", stopPropagation],
        ["mousedown", handleMouseDown],
        ["mousemove", handleMouseMove],
        ["mouseup", handleMouseUp]
    ])
}
