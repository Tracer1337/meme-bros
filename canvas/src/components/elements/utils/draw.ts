import { setDOMListeners } from "@meme-bros/client-lib"
import { Editor } from "@meme-bros/shared"

function stopPropagation(event: Event) {
    event.stopPropagation()
}

export type Path = Editor.PickElement<"path">["data"]["paths"][number]

export function setupDrawingCanvas({
    canvas,
    element,
    onUpdate
}: {
    canvas: HTMLCanvasElement,
    element: Editor.PickElement<"path">,
    onUpdate: (path: Path[]) => void
}) {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    const context = canvas.getContext("2d")
    const offset = canvas.getBoundingClientRect()
    let currentPath: Path = []
    let isDrawing = false

    if (!context) {
        throw new Error("Could not obtain drawing context")
    }

    const draw = () => {
        clear()
        element.data.paths.forEach(drawPath)
        drawPath(currentPath)
    }

    const clear = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
    }

    const drawPath = (path: Path) => {
        if (path.length === 0) {
            return
        }

        context.fillStyle = element.data.color
        context.strokeStyle = element.data.color
        context.lineWidth = element.data.width
        context.lineCap = "round"

        context.beginPath()
        context.moveTo(path[0][0], path[0][1])
        context.arc(0, 0, 2, 0, Math.PI * 2, false)
        context.fill()
        
        context.beginPath()
        context.moveTo(path[0][0], path[0][1])
        path.forEach((point) => {
            context.lineTo(point[0], point[1])
        })
        context.stroke()
    }

    const handleMouseDown = (event: MouseEvent) => {
        isDrawing = true
        currentPath.push([
            event.x - offset.x,
            event.y - offset.y
        ])
        draw()
    }

    const handleMouseMove = (event: MouseEvent) => {
        if (!isDrawing) {
            return
        }
        currentPath.push([
            event.x - offset.x,
            event.y - offset.y
        ])
        draw()
    }

    const handleMouseUp = () => {
        isDrawing = false
        onUpdate([...element.data.paths, currentPath])
        currentPath = []
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
