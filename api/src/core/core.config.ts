import Joi from "joi"
import { registerAs } from "@nestjs/config"

export const coreConfigSchema = Joi.object({
    CORE_URI: Joi.string().uri()
})

export const coreConfig = registerAs("core", () => {
    coreConfigSchema.validate(process.env)
    return {
        uri: process.env.CORE_URI || "http://localhost:8000"
    }
})
