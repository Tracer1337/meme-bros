import fs from "fs"
import path from "path"
import { render } from "./src/render"

async function generate() {
    const mockPath = path.join(__dirname, "mock.json")
    const mock = await fs.promises.readFile(mockPath, "utf8")

    const t0 = performance.now()
    const output = await render(mock)
    console.log(`Generated in ${performance.now() - t0}ms`)

    await storePNG(output)
}

async function storePNG(dataURI: string) {
    const buffer = Buffer.from(dataURI.split(",")[1], "base64")
    const filepath = path.join(__dirname, "image.png")
    await fs.promises.writeFile(filepath, buffer)
}

generate()
