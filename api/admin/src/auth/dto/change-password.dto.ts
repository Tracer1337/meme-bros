import { IsString, IsNotEmpty } from "class-validator"

export class ChangePasswordDTO {
    @IsString()
    @IsNotEmpty()
    oldPassword: string

    @IsString()
    @IsNotEmpty()
    newPassword: string
}
