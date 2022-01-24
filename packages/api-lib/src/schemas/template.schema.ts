import type { Editor } from "@meme-bros/client-lib"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, SchemaTypes } from "mongoose"

export type TemplateDocument = Template & Document

@Schema()
export class Template {
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    hash: string


    @Prop({ required: true, default: 0 })
    uses: number

    @Prop()
    previewFile: string

    @Prop({
        required: true,
        type: SchemaTypes.Mixed
    })
    canvas: Editor.Canvas
}

export const TemplateSchema = SchemaFactory.createForClass(Template)
