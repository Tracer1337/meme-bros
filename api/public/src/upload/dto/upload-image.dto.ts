import { IsNotEmpty, IsDataURI } from "class-validator"

export class UploadImageDTO {
    @IsNotEmpty()
    @IsDataURI()
    dataURI: string
}
