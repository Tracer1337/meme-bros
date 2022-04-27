import Joi from "joi"
import { registerAs } from "@nestjs/config"

export const imgurConfigSchema = Joi.object({
    IMGUR_CLIENT_ID: Joi.string()
})

export const imgurConfig = registerAs("imgur", () => {
    imgurConfigSchema.validate(process.env)
    return {
        clientId: process.env.IMGUR_CLIENT_ID || "c9fae57278f6764"
    }
})
