import { Type } from "class-transformer"
import { IsInt, IsOptional, Max, Min } from "class-validator"

export class PaginationDTO {
    @IsInt()
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    page?: number = 0

    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    @Type(() => Number)
    per_page?: number = 10
}
