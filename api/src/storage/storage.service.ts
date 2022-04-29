import { Inject, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common"
import { ConfigType } from "@nestjs/config"
import * as minio from "minio"
import { v4 as uuid } from "uuid"
import { storageConfig } from "./storage.config"

@Injectable()
export class StorageService implements OnModuleInit {
    constructor(
        @Inject(storageConfig.KEY)
        private readonly config: ConfigType<typeof storageConfig>,
        @Inject("MINIO") private readonly minioClient: minio.Client
    ) {}

    async onModuleInit() {
        const bucketExists = await this.minioClient.bucketExists(
            this.config.bucketName
        )
        if (!bucketExists) {
            await this.minioClient.makeBucket(
                this.config.bucketName,
                this.config.bucketRegion
            )
        }
    }

    async put(buffer: Buffer, ext: string) {
        const filename = `${uuid()}.${ext}`
        await this.minioClient.putObject(
            this.config.bucketName,
            filename,
            buffer
        )
        return filename
    }

    async get(filename: string) {
        return await this.minioClient.getObject(
            this.config.bucketName,
            filename
        )
    }

    async delete(filename: string) {
        await this.minioClient.removeObject(
            this.config.bucketName,
            filename
        )
    }

    async exists(filename: string) {
        try {
            await this.minioClient.statObject(
                this.config.bucketName,
                filename
            )
            return true
        } catch {
            return false
        }
    }

    async assertFileExists(filename: string) {
        const fileExists = await this.exists(filename)
        if (!fileExists) {
            throw new NotFoundException()
        }
    }
}
