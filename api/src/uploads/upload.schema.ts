import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type UploadDocument = Upload & Document

@Schema()
export class Upload {
    @Prop({ required: true, unique: true })
    id: string

    @Prop({ required: true })
    link: string

    @Prop({ required: true })
    deletehash: string
}

export const UploadSchema = SchemaFactory.createForClass(Upload)
