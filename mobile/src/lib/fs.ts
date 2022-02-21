import { join } from "@meme-bros/client-lib"
import * as RNFS from "react-native-fs"

// Workaround for https://github.com/itinance/react-native-fs/pull/837
export async function writeFilePatched(path: string, data: string) {
    await RNFS.unlink(path)
    await RNFS.writeFile(path, data)
}

export async function copyFolderAssets(from: string, to: string) {
    await RNFS.mkdir(to)
    const files = await RNFS.readDirAssets(from)
    await Promise.all(files.map((file) => {
        if (file.isDirectory()) {
            return copyFolderAssets(file.path, join(to, file.name))
        }
        return RNFS.copyFileAssets(file.path, join(to, file.name))
    }))
}
