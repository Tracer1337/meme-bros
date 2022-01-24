import type { Editor } from "@meme-bros/client-lib"
import { IsString, IsNotEmpty, Allow } from "class-validator"

export class CreateTemplateDTO {
    @IsString()
    @IsNotEmpty()
    name: string

    @Allow()
    canvas: Editor.Canvas
}
