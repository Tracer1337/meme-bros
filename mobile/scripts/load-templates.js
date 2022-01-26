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

async function fetchTemplates() {
    const res = await fetch(`${API_HOST}/templates`)
    return await res.json()
}

async function fetchHash() {
    const res = await fetch(`${API_HOST}/templates/hash`)
    return await res.text()
}

async function fetchHashList() {
    const res = await fetch(`${API_HOST}/templates/list/hash`)
    return await res.json()
}

async function fetchNewList() {
    const res = await fetch(`${API_HOST}/templates/list/new`)
    return await res.json()
}

async function fetchTopList() {
    const res = await fetch(`${API_HOST}/templates/list/top`)
    return await res.json()
}

async function fetchHotList() {
    const res = await fetch(`${API_HOST}/templates/list/hot`)
    return await res.json()
}

async function hasHashChanged(hash) {
    const json = await readFileIfExists(TEMPLATES_FILE)
    return !json ? true : JSON.parse(json).hash !== hash
}

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
    const hash = await fetchHash()

    if (!(await hasHashChanged(hash))) {
        console.log("Skip downloading templates")
        return
    }
    
    console.log("Download templates")
    
    await Promise.all([
        fs.promises.unlink(TEMPLATES_FILE),
        fs.promises.rm(TEMPLATES_DIR, { recursive: true, force: true }),
        fs.promises.rm(PREVIEWS_DIR, { recursive: true, force: true }),
    ])

    await Promise.all([
        assertDirExists(TEMPLATES_DIR),
        assertDirExists(PREVIEWS_DIR)
    ])

    const [hashList, newList, topList, hotList] = await Promise.all([
        fetchHashList(),
        fetchNewList(),
        fetchTopList(),
        fetchHotList()
    ])

    const result = {
        hash,
        hashList,
        newList,
        topList,
        hotList,
        meta: {}
    }

    const templates = await fetchTemplates()

    await Promise.all(templates.map(async (template) => {
        const [templateFile, previewFile] = await Promise.all([
            storeCanvas(template),
            downloadPreview(template)
        ])
        result.meta[template.id] = {
            id: template.id,
            name: template.name,
            hash: template.hash,
            templateFile,
            previewFile
        }
    }))

    await fs.promises.writeFile(
        TEMPLATES_FILE,
        JSON.stringify(result, null, 4)
    )
}

loadTemplates()
