import { Type } from "class-transformer"
import { ArrayMaxSize, IsArray, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, ValidateNested } from "class-validator"

class TextboxDTO {
    @IsNumber()
    @Min(0)
    @Max(1)
    w: number

    @IsNumber()
    @Min(0)
    @Max(1)
    h: number

    @IsNumber()
    @Min(0)
    @Max(1)
    x: number

    @IsNumber()
    @Min(0)
    @Max(1)
    y: number
}

export class CreateTemplateDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string
    
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMaxSize(20)
    @Type(() => TextboxDTO)
    textboxes: TextboxDTO[]
}
