import Joi from "joi"

export const configurationSchema = Joi.object({
    PORT: Joi.number().port(),
    MONGODB_URI: Joi.string().uri(),
    STORAGE_PATH: Joi.string(),
    IMGUR_CLIENT_ID: Joi.string()
})
