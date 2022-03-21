/* eslint-disable */

importScripts("/assets/wasm_exec.js")

const CORE_WASM_URL = "/assets/core.wasm"

function loadCore() {
    return new Promise((resolve) => {
        const go = new self.Go()
        WebAssembly
            .instantiateStreaming(fetch(CORE_WASM_URL), go.importObject)
            .then((obj) => {
                go.run(obj.instance)
                resolve()
            })
    })
}

const assets = {}
const activeDownloads = {}

async function fetchAsset(path) {
    if (!(path in activeDownloads)) {
        activeDownloads[path] = new Promise(async (resolve) => {
            const res = await fetch(`/assets/${path}`)
            assets[path] = new Uint8Array(await res.arrayBuffer())
            delete activeDownloads[path]
            resolve()
        })
    }
    await activeDownloads[path]
}

async function readAsset(path) {
    if (!(path in assets)) {
        await fetchAsset(path)
    }
    return assets[path]
}

const coreModules = { readAsset }

onmessage = async (event) => {
    const dataURI = await render(event.data, coreModules)
    postMessage({ type: "data", data: dataURI })
}

async function init() {
    await loadCore()
    postMessage({ type: "ready" })
}

init()
