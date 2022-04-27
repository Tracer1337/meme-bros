import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, SchemaTypes } from "mongoose"

export type TrendDocument = Trend & Document

@Schema()
export class Trend {
    @Prop({ required: true, unique: true })
    name: string

    @Prop({
        required: true,
        type: SchemaTypes.Map,
        of: Number,
        default: {},
    })
    scores: Map<string, number>
}

export const TrendSchema = SchemaFactory.createForClass(Trend)
