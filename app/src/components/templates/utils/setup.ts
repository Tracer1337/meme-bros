import { Platform } from "react-native"
import RNFS from "react-native-fs"
import { TEMPLATES_DIR, PREVIEWS_DIR, TEMPLATES_FILE } from "./constants"

async function setupTemplatesFolder() {
    const path = `${RNFS.DocumentDirectoryPath}/${TEMPLATES_DIR}`
    if (await RNFS.exists(path)) {
        return
    }
    await RNFS.mkdir(path)
    const templates = await RNFS.readDirAssets(TEMPLATES_DIR)
    await Promise.all(templates.map((from) => {
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
    const previews = await RNFS.readDirAssets(PREVIEWS_DIR)
    await Promise.all(previews.map((from) => {
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
        setupTemplatesFolder(),
        setupPreviewsFolder(),
        setupTemplatesFile()
    ])
}
