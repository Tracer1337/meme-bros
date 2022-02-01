import Joi from "joi"

export const configurationSchema = Joi.object({
    PORT: Joi.number().port(),
    MONGODB_URI: Joi.string().uri(),
    TREND_URI: Joi.string().uri(),
    CORE_URI: Joi.string().uri(),
    STORAGE_PATH: Joi.string(),
    JWT_SECRET: Joi.string()
})
