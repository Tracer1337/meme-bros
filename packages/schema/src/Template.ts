import mongoose from "mongoose"

type Textbox = {
    w: number,
    h: number,
    x: number,
    y: number
}

type Template = {
    name: string,
    imageUrl: string,
    textboxes: Textbox[]
}

const TextboxSchema = new mongoose.Schema<Textbox>({
    w: Number,
    h: Number,
    x: Number,
    y: Number
})

const TemplateSchema = new mongoose.Schema<Template>({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    textboxes: [TextboxSchema]
})

const TemplateModel = mongoose.model<Template>("Template", TemplateSchema)

export {
    Template,
    TemplateModel,
    TemplateSchema
}
