import fs from "fs/promises"
import path from "path"
import { v4 as uuid } from "uuid"

export class StorageService {
    static readonly STORAGE_DIR = path.join(__dirname, "..", "..", "storage")

    async put(buffer: Buffer, ext: string) {
        const filename = `${uuid()}.${ext}`
        await this.assertStorageDirExists()
        await fs.writeFile(this.getFilePath(filename), buffer)
        return filename
    }

    get(filename: string) {
        return fs.readFile(this.getFilePath(filename))
    }

    getFilePath(filename: string) {
        return path.join(StorageService.STORAGE_DIR, filename)
    }

    async assertStorageDirExists() {
        try {
            await fs.access(StorageService.STORAGE_DIR)
        } catch {
            await fs.mkdir(StorageService.STORAGE_DIR)
        }
    }
}
