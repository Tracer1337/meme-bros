import Joi from "joi"

const schema = Joi.object({
    PORT: Joi.number().port()
}).unknown(true)

Joi.assert(process.env, schema)

const config = {
    port: parseInt(process.env.PORT) || 7000
} as const

export default config
