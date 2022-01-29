import { IsArray, IsNotEmpty, IsString } from "class-validator"

export class SyncSubjectsDTO {
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    ids: string[]
}
