import { Modules } from "@meme-bros/client-lib"
import Canvas from "@meme-bros/canvas"

export function useCanvasModule(): Modules.CanvasModule {
    return {
        CanvasComponent: Canvas
    }
}
