import Joi from "joi"

const rectSchema = Joi.object({
    x: Joi.number().required(),
    y: Joi.number().required(),
    width: Joi.number().required(),
    height: Joi.number().required(),
    rotation: Joi.number().required()
})

const imageElementSchema = Joi.object({
    type: Joi.string().equal("image"),
    rect: rectSchema.required(),
    data: Joi.object({
        uri: Joi.string().required(),
        borderRadius: Joi.number(),
        loop: Joi.bool()
    }).required()
})

const textboxElementSchema = Joi.object({
    type: Joi.string().equal("textbox"),
    rect: rectSchema.required(),
    data: Joi.object({
        text: Joi.string().required(),
        fontFamily: Joi.string(),
        fontWeight: Joi.string(),
        textAlign: Joi.string(),
        verticalAlign: Joi.string(),
        color: Joi.string(),
        caps: Joi.bool(),
        outlineWidth: Joi.number(),
        outlineColor: Joi.string(),
        backgroundColor: Joi.string(),
        padding: Joi.number()
    }).required()
})

const shapeElementSchema = Joi.object({
    type: Joi.string().equal("shape"),
    rect: rectSchema.required(),
    data: Joi.object({
        variant: Joi.string(),
        backgroundColor: Joi.string(),
        borderColor: Joi.string(),
        borderWidth: Joi.number()
    }).required()
})

const canvasElementSchema = Joi.alternatives().try(
    imageElementSchema,
    textboxElementSchema,
    shapeElementSchema
)

const canvasSchema = Joi.object({
    width: Joi.number().required(),
    height: Joi.number().required(),
    pixelRatio: Joi.number(),
    multiPalette: Joi.bool(),
    debug: Joi.bool(),
    backgroundColor: Joi.string(),
    elements: Joi.array().items(canvasElementSchema).required()
})

export { canvasSchema as canvasValidator }
