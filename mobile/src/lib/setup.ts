import { CANVAS_DIR, PREVIEWS_DIR, TEMPLATES_FILE } from "@meme-bros/client-lib"
import { Platform } from "react-native"
import RNFS from "react-native-fs"

async function setupCanvasFolder() {
    const path = `${RNFS.DocumentDirectoryPath}/${CANVAS_DIR}`
    if (await RNFS.exists(path)) {
        return
    }
    await RNFS.mkdir(path)
    const files = await RNFS.readDirAssets(CANVAS_DIR)
    await Promise.all(files.map((from) => {
        const to = `${path}/${from.name}`
        return RNFS.copyFileAssets(from.path, to)
    }))
}

async function setupPreviewsFolder() {
    const path = `${RNFS.DocumentDirectoryPath}/${PREVIEWS_DIR}`
    if (await RNFS.exists(path)) {
        return
    }
    await RNFS.mkdir(path)
    const files = await RNFS.readDirAssets(PREVIEWS_DIR)
    await Promise.all(files.map((from) => {
        const to = `${path}/${from.name}`
        return RNFS.copyFileAssets(from.path, to)
    }))
}

async function setupTemplatesFile() {
    const path = `${RNFS.DocumentDirectoryPath}/${TEMPLATES_FILE}`
    if (await RNFS.exists(path)) {
        return
    }
    await RNFS.copyFileAssets(TEMPLATES_FILE, path)
}

export async function setupTemplatesStorage() {
    if (Platform.OS !== "android") {
        throw new Error("Not implemented")
    }

    await Promise.all([
        setupCanvasFolder(),
        setupPreviewsFolder(),
        setupTemplatesFile()
    ])
}
