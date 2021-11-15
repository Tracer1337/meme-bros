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

const textboxSchema = new mongoose.Schema<Textbox>({
    w: Number,
    h: Number,
    x: Number,
    y: Number
})

const templateSchema = new mongoose.Schema<Template>({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    textboxes: [textboxSchema]
})

export default mongoose.model<Template>("Template", templateSchema)

export {
    Template,
    templateSchema
}
