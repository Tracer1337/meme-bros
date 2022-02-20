import fs from "fs"
import path from "path"
import {
    getBase64FromDataURI,
    getFileExtensionFromDataURI
} from "@meme-bros/shared"
import { render } from "./src"

async function test() {
    const json = await fs.promises.readFile(
        path.join(__dirname, "mock.json"),
        "utf-8"
    )
    const canvas = JSON.parse(json)
    const t0 = performance.now()
    const dataURI = await render(canvas)
    console.log(`Renderd in ${performance.now() - t0}ms`)
    await fs.promises.writeFile(
        `rendered.${getFileExtensionFromDataURI(dataURI)}`,
        Buffer.from(getBase64FromDataURI(dataURI), "base64")
    )
}

test()
