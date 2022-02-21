const fs = require("fs")
const path = require("path")
const fetch = require("node-fetch")
const { pipeline } = require("stream")
const { promisify } = require("util")
const { PublicAPI } = require("@meme-bros/api-sdk")
const {
    syncResources,
    RESOURCES_DIR: RESOURCES_DIR_NAME
} = require("@meme-bros/client-lib/dist/sync")

const streamPipeline = promisify(pipeline)

const api = new PublicAPI({
    host: process.env.API_HOST || "http://localhost:6006"
})

const RESOURCES_DIR = path.resolve(
    __dirname, "..", "android", "app", "src", "main", "assets", RESOURCES_DIR_NAME
)

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

syncResources({
    api,
    clean: true,
    path: RESOURCES_DIR,
    fs: {
        rm: (path) => fs.promises.rm(path, {
            force: true,
            recursive: true
        }),
        mkdir: (path) => fs.promises.mkdir(path, {
            recursive: true
        }),
        readFile: readFileIfExists,
        writeFile: fs.promises.writeFile,
        exists
    },
    download: async (url, to) => {
        const res = await fetch(url)
        await streamPipeline(res.body, fs.createWriteStream(to))
    }
})

