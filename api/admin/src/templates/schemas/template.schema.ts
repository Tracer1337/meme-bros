import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, SchemaTypes } from "mongoose"

export type TemplateDocument = Template & Document

@Schema()
export class Template {
    @Prop({ required: true })
    name: string

    @Prop({
        required: true,
        type: SchemaTypes.Mixed
    })
    canvas: object
}

export const TemplateSchema = SchemaFactory.createForClass(Template)
