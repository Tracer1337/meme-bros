import Joi from "joi"
import { registerAs } from "@nestjs/config"

export const storageConfigSchema = Joi.object({
    MINIO_END_POINT: Joi.string(),
    MINIO_PORT: Joi.number().port(),
    MINIO_USE_SSL: Joi.string().allow("1", "0"),
    MINIO_ACCESS_KEY: Joi.string(),
    MINIO_SECRET_KEY: Joi.string(),
    NINIO_BUCKET_NAME: Joi.string(),
    MINIO_BUCKET_REGION: Joi.string()
})

export const storageConfig = registerAs("storage", () => {
    storageConfigSchema.validate(process.env)
    return {
        endPoint: process.env.MINIO_END_POINT || "127.0.0.1",
        port: parseInt(process.env.MINIO_PORT) || 9000,
        useSSL: !!parseInt(process.env.MINIO_USE_SSL),
        accessKey: process.env.MINIO_ACCESS_KEY || "85PRYtYCbZxIeARk",
        secretKey: process.env.MINIO_SECRET_KEY || "owxo6h52rdlDOxMDJwKvrUhzaqePtYn7",
        bucketName: process.env.MINIO_BUCKET_NAME || "meme-bros",
        bucketRegion: process.env.MINIO_BUCKET_REGION || "us-east-1"
    }
})
