import Joi from "joi"

const colorSchema = Joi.string()

const rectSchema = Joi.object({
    x: Joi.number().required(),
    y: Joi.number().required(),
    width: Joi.number().required(),
    height: Joi.number().required(),
    rotation: Joi.number().required()
})

const canvasBaseSchema = Joi.object({
    id: Joi.number().required(),
    rounded: Joi.bool().required(),
    padding: Joi.bool().required(),
    rect: rectSchema.required()
})

const imageElementSchema = Joi.object({
    id: Joi.number().required(),
    type: Joi.string().equal("image"),
    rect: rectSchema.required(),
    data: Joi.object({
        uri: Joi.string().required(),
        borderRadius: Joi.number(),
        loop: Joi.bool(),
        animated: Joi.bool(),
        keepAspectRatio: Joi.bool(),
        naturalWidth: Joi.number(),
        naturalHeight: Joi.number()
    }).required()
})

const textboxElementSchema = Joi.object({
    id: Joi.number().required(),
    type: Joi.string().equal("textbox"),
    rect: rectSchema.required(),
    data: Joi.object({
        text: Joi.string().required(),
        fontFamily: Joi.string(),
        fontWeight: Joi.string(),
        textAlign: Joi.string(),
        verticalAlign: Joi.string(),
        color: colorSchema,
        caps: Joi.bool(),
        outlineWidth: Joi.number(),
        outlineColor: colorSchema,
        backgroundColor: colorSchema,
        padding: Joi.number()
    }).required()
})

const shapeElementSchema = Joi.object({
    id: Joi.number().required(),
    type: Joi.string().equal("shape"),
    rect: rectSchema.required(),
    data: Joi.object({
        variant: Joi.string(),
        backgroundColor: colorSchema,
        borderColor: colorSchema,
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
    debug: Joi.bool().allow(false),
    backgroundColor: colorSchema.required(),
    mode: Joi.number().allow(0, 1),
    base: canvasBaseSchema.when("mode", {
        is: 0,
        then: Joi.required(),
        otherwise: Joi.forbidden()
    }),
    elements: Joi.object().pattern(
        Joi.string(),
        canvasElementSchema
    ),
    layers: Joi.array().items(Joi.number()).unique()
})

export { canvasSchema as canvasValidator }
