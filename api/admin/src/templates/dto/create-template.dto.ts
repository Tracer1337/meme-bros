import { IsString, IsNotEmpty } from "class-validator"

export class CreateTemplateDTO {
    @IsString()
    @IsNotEmpty()
    name: string
}
