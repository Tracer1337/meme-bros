import { IsNotEmpty, IsDataURI } from "class-validator"

export class CreateStickerDTO {
    @IsNotEmpty()
    @IsDataURI()
    uri: string
}
