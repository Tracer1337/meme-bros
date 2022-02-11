import { canvasFromJSON } from "./parser"

export async function renderFromJSON(json: string) {
    return await canvasFromJSON(json).render()
}
