import { Editor } from "@meme-bros/shared"
import { IsString, IsNotEmpty, Allow } from "class-validator"

export class CreateTemplateDTO {
    @IsString()
    @IsNotEmpty()
    name: string

    @Allow()
    canvas: Editor.Canvas
}
