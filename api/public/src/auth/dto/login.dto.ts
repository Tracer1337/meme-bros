import { IsNotEmpty, IsString } from "class-validator"

export class LoginDTO {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    password: string
}
