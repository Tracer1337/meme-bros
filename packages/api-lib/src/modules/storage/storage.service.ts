import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { createReadStream } from "fs"
import fs from "fs/promises"
import path from "path"
import { v4 as uuid } from "uuid"
import { STORAGE_OPTIONS_KEY } from "./constants"
import { StorageModuleOptions } from "./interfaces/storage-module-options.interface"

@Injectable()
export class StorageService {
    constructor(
        @Inject(STORAGE_OPTIONS_KEY) private readonly options: StorageModuleOptions
    ) {}

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

    async delete(filename: string) {
        return await fs.unlink(this.getFilePath(filename))
    }

    getFilePath(filename: string) {
        return path.join(this.options.path, filename)
    }

    async exists(path: string) {
        try {
            await fs.access(path)
            return true
        } catch {
            return false
        }
    }

    async assertFileExists(filename: string) {
        if (!await this.exists(this.getFilePath(filename))) {
            throw new NotFoundException()
        }
    }

    async assertStorageDirExists() {
        if (!await this.exists(this.options.path)) {
            await fs.mkdir(this.options.path)
        }
    }
}
