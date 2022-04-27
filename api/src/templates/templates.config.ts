import Joi from "joi"
import { registerAs } from "@nestjs/config"

export const templatesConfigSchema = Joi.object({
    TEMPLATES_PREVIEW_WIDTH: Joi.number().positive(),
    TEMPLATES_PREVIEW_HEIGHT: Joi.number().positive(),
    TEMPLATES_TREND_NAME: Joi.string(),
    TEMPLATES_TREND_DAMPING: Joi.number().positive(),
    TEMPLATES_TREND_REDUCTION: Joi.number().positive()
})

export const templatesConfig = registerAs("templates", () => {
    templatesConfigSchema.validate(process.env)
    return {
        preview: {
            width: parseInt(process.env.TEMPLATES_PREVIEW_WIDTH) || 500,
            height: parseInt(process.env.TEMPLATES_PREVIEW_HEIGHT) || 500
        },
        trend: {
            name: process.env.TEMPLATES_TREND_NAME || "templates",
            damping: parseInt(process.env.TEMPLATES_TREND_DAMPING) || 10,
            reduction: parseInt(process.env.TEMPLATES_TREND_REDUCTION) || 100
        }
    }
})
