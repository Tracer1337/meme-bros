import * as RNFS from "react-native-fs"

// Workaround for https://github.com/itinance/react-native-fs/pull/837
export async function writeFilePatched(path: string, data: string) {
    await RNFS.unlink(path)
    await RNFS.writeFile(path, data)
}
