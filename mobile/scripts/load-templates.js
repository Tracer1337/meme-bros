const fs = require("fs")
const path = require("path")
const fetch = require("node-fetch")
const { pipeline } = require("stream")
const { promisify } = require("util")
const { API } = require("@meme-bros/api-sdk")

const streamPipeline = promisify(pipeline)

const api = new API(
    process.env.API_HOST || "http://localhost:6000"
)

const ASSETS_DIR = path.join(__dirname, "..", "android", "app", "src", "main", "assets")
const CANVAS_DIR = path.join(ASSETS_DIR, "canvases")
const PREVIEWS_DIR = path.join(ASSETS_DIR, "previews")
const TEMPLATES_FILE = path.join(ASSETS_DIR, "templates.json")

async function readFileIfExists(filepath) {
    try {
        return await fs.promises.readFile(filepath, "utf8")
    } catch {
        return null
    }
}

async function assertDirExists(dir) {
    try {
        await fs.promises.access(dir)
    } catch {
        await fs.promises.mkdir(dir)
    }
}

async function hasHashChanged(hash) {
    const json = await readFileIfExists(TEMPLATES_FILE)
    return !json ? true : JSON.parse(json).hash !== hash
}

async function downloadCanvas(template) {
    const filename = `${template.hash}.json`
    const filepath = path.join(CANVAS_DIR, filename)
    const res = await fetch(api.templates.getCanvasURL(template))
    await streamPipeline(res.body, fs.createWriteStream(filepath))
    return filename
}

async function downloadPreview(template) {
    const filepath = path.join(PREVIEWS_DIR, template.previewFile)
    const res = await fetch(api.storage.getTemplatePreviewURL(template))
    await streamPipeline(res.body, fs.createWriteStream(filepath))
}

async function loadTemplates() {
    const hash = await api.templates.getHash()

    if (!(await hasHashChanged(hash))) {
        console.log("Skip downloading templates")
        return
    }

    console.log("Download templates")

    await Promise.all([
        fs.promises.rm(TEMPLATES_FILE, { force: true }),
        fs.promises.rm(CANVAS_DIR, { recursive: true, force: true }),
        fs.promises.rm(PREVIEWS_DIR, { recursive: true, force: true }),
    ])

    await Promise.all([
        assertDirExists(CANVAS_DIR),
        assertDirExists(PREVIEWS_DIR)
    ])

    const [hashList, newList, topList, hotList] = await Promise.all([
        api.templates.getHashList(),
        api.templates.getNewList(),
        api.templates.getTopList(),
        api.templates.getHotList()
    ])

    const result = {
        hash,
        hashList,
        newList,
        topList,
        hotList,
        meta: {}
    }

    const templates = await api.templates.getAll()

    await Promise.all(templates.map(async (template) => {
        const [canvasFile] = await Promise.all([
            downloadCanvas(template),
            downloadPreview(template)
        ])
        result.meta[template.id] = {
            id: template.id,
            name: template.name,
            hash: template.hash,
            previewFile: template.previewFile,
            canvasFile
        }
    }))

    await fs.promises.writeFile(
        TEMPLATES_FILE,
        JSON.stringify(result, null, 4)
    )
}

loadTemplates()
