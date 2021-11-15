import mongoose from "mongoose"

type Textbox = {
    w: number,
    h: number,
    x: number,
    y: number
}

type Template = {
    imageUrl: string,
    textBoxes: Textbox[]
}

const textboxSchema = new mongoose.Schema<Textbox>({
    w: Number,
    h: Number,
    x: Number,
    y: Number
})

const templateSchema = new mongoose.Schema<Template>({
    imageUrl: {
        type: String,
        required: true
    },
    textBoxes: [textboxSchema]
})

export default mongoose.model<Template>("Template", templateSchema)

export {
    Template,
    templateSchema
}
