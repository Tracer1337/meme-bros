const fs = require("fs")
const path = require("path")
const fetch = require("node-fetch")
const { pipeline } = require("stream")
const { promisify } = require("util")

const streamPipeline = promisify(pipeline)

const API_HOST = process.env.API_HOST || "http://localhost:6000"

const ASSETS_DIR = path.join(__dirname, "..", "android", "app", "src", "main", "assets")
const TEMPLATES_DIR = path.join(ASSETS_DIR, "templates")
const PREVIEWS_DIR = path.join(ASSETS_DIR, "previews")
const TEMPLATES_FILE = path.join(ASSETS_DIR, "templates.json")

async function fetchList() {
    const res = await fetch(`${API_HOST}/templates/list`)
    return await res.json()
}

async function fetchListHash() {
    const res = await fetch(`${API_HOST}/templates/list/hash`)
    return await res.text()
}

async function assertDirExists(dir) {
    try {
        await fs.promises.access(dir)
    } catch {
        await fs.promises.mkdir(dir)
    }
}

async function storeCanvas(template) {
    const filename = `${template.id}.json`
    await fs.promises.writeFile(
        path.join(TEMPLATES_DIR, filename),
        JSON.stringify(template.canvas, null, 4)
    )
    return filename
}

async function downloadPreview(template) {
    const filename = `${template.id}.png`
    const filepath = path.join(PREVIEWS_DIR, filename)
    const res = await fetch(`${API_HOST}/storage/${template.previewFile}`)
    await streamPipeline(res.body, fs.createWriteStream(filepath))
    return filename
}

async function loadTemplates() {
    await Promise.all([
        assertDirExists(TEMPLATES_DIR),
        assertDirExists(PREVIEWS_DIR)
    ])

    const [list, hash] = await Promise.all([
        fetchList(),
        fetchListHash()
    ])

    const res = await fetch(`${API_HOST}/templates`)
    const templates = await res.json()

    const meta = {}

    await Promise.all(templates.map(async (template) => {
        const [templateFile, previewFile] = await Promise.all([
            storeCanvas(template),
            downloadPreview(template)
        ])
        meta[template.hash] = {
            id: template.id,
            name: template.name,
            hash: template.hash,
            templateFile,
            previewFile
        }
    }))

    const templateFile = { list, hash, meta }
    await fs.promises.writeFile(
        TEMPLATES_FILE,
        JSON.stringify(templateFile, null, 4)
    )
}

loadTemplates()
