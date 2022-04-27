import { registerAs } from "@nestjs/config"
import Joi from "joi"

export const authConfigSchema = Joi.object({
    JWT_SECRET: Joi.string()
})

export const authConfig = registerAs("auth", () => {
    authConfigSchema.validate(process.env)
    return {
        jwt: {
            secret: process.env.JWT_SECRET || "secret"
        }
    }
})
