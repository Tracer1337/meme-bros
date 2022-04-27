import { Editor } from "@meme-bros/shared"
import { IsString, IsNotEmpty, Allow, IsOptional, IsNumber } from "class-validator"

export class CreateTemplateDTO {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNumber()
    @IsOptional()
    uses: number

    @Allow()
    canvas: Editor.Canvas
}
