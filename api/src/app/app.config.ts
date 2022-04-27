import Joi from "joi"
import { registerAs } from "@nestjs/config"

export const appConfigSchema = Joi.object({
    PORT: Joi.number().port(),
    MONGODB_URI: Joi.string().uri(),
    THROTTLE_TTL: Joi.number().positive(),
    THROTTLE_LIMIT: Joi.number().positive()
})

export const appConfig = registerAs("app", () => {
    appConfigSchema.validate(process.env)
    return {
        port: parseInt(process.env.PORT) || 5000,
        database: {
            uri: process.env.MONGODB_URI || "mongodb://localhost/meme-bros"
        },
        throttle: {
            ttl: parseInt(process.env.THROTTLE_TTL) || 60,
            limit: parseInt(process.env.THROTTLE_LIMIT) || 10
        }
    }
})
