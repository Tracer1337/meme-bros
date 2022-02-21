import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type StickerDocument = Sticker & Document

@Schema()
export class Sticker {
    @Prop({ required: true, unique: true })
    filename: string

    @Prop({ required: true, default: 0 })
    uses: number
}

export const StickerSchema = SchemaFactory.createForClass(Sticker)
