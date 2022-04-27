import Joi from "joi"
import { registerAs } from "@nestjs/config"
import path from "path"

const REPOSITORY_ROOT_DIR = path.resolve(__dirname, "..", "..", "..")

export const storageConfigSchema = Joi.object({
    STORAGE_PATH: Joi.string()
})

export const storageConfig = registerAs("storage", () => {
    storageConfigSchema.validate(process.env)
    return {
        path: process.env.STORAGE_PATH || path.join(REPOSITORY_ROOT_DIR, "storage")
    }
})
