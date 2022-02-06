import * as Core from "@meme-bros/core-types"

export namespace Workers {
    export function render(canvas: Core.Canvas) {
        return new Promise<string>((resolve) => {
            const worker = new Worker("/workers/render.js")
            worker.addEventListener("message", ({ data }) => {
                resolve(data)
                worker.terminate()
            })
            worker.postMessage(JSON.stringify(canvas))
        })
    }
}
