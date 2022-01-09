import { NotFoundException } from "@nestjs/common"
import { createReadStream } from "fs"
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

    async get(filename: string) {
        return await fs.readFile(this.getFilePath(filename))
    }

    getReadStream(filename: string) {
        return createReadStream(this.getFilePath(filename))
    }

    async assertFileExists(filename: string) {
        if (!await this.exists(this.getFilePath(filename))) {
            throw new NotFoundException()
        }
    }

    getFilePath(filename: string) {
        return path.join(StorageService.STORAGE_DIR, filename)
    }

    async exists(path: string) {
        try {
            await fs.access(path)
            return true
        } catch {
            return false
        }
    }

    async assertStorageDirExists() {
        if (!await this.exists(StorageService.STORAGE_DIR)) {
            await fs.mkdir(StorageService.STORAGE_DIR)
        }
    }
}
