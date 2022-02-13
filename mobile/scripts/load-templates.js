const fs = require("fs")
const path = require("path")
const fetch = require("node-fetch")
const { pipeline } = require("stream")
const { promisify } = require("util")
const { PublicAPI } = require("@meme-bros/api-sdk")
const { syncTemplates } = require("@meme-bros/client-lib/dist/templates")

const streamPipeline = promisify(pipeline)

const api = new PublicAPI({
    host: process.env.API_HOST || "http://localhost:6006"
})

const ASSETS_DIR = path.resolve(__dirname, "..", "android", "app", "src", "main", "assets")

async function readFileIfExists(filepath) {
    try {
        return await fs.promises.readFile(filepath, "utf8")
    } catch {
        return null
    }
}

async function exists(dir) {
    try {
        await fs.promises.access(dir)
        return true
    } catch {
        return false
    }
}

syncTemplates({
    api,
    clean: true,
    path: ASSETS_DIR,
    fs: {
        rm: (path) => fs.promises.rm(path, {
            force: true,
            recursive: true
        }),
        mkdir: fs.promises.mkdir,
        readFile: readFileIfExists,
        writeFile: fs.promises.writeFile,
        exists
    },
    download: async (url, to) => {
        const res = await fetch(url)
        await streamPipeline(res.body, fs.createWriteStream(to))
    }
})

