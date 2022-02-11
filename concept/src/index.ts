import fs from "fs"
import path from "path"
// import { performance } from "perf_hooks"
import { renderFromJSON } from "./api"
import { canvasFromJSON } from "./parser"

async function generate() {
    const mockPath = path.join(__dirname, "..", "mock.json")
    const mock = await fs.promises.readFile(mockPath, "utf8")

    const t0 = performance.now()
    const output = await renderFromJSON(mock)
    console.log(`Generated in ${performance.now() - t0}ms`)

    const canvas = canvasFromJSON(mock)
    if (canvas.animated) {
        await storeGIF(output)
    } else {
        await storePNG(output)
    }
}

async function storeGIF(dataURI: string) {}

async function storePNG(dataURI: string) {
    const buffer = Buffer.from(dataURI.split(",")[1], "base64")
    const filepath = path.join(__dirname, "..", "image.png")
    await fs.promises.writeFile(filepath, buffer)
}

generate()
