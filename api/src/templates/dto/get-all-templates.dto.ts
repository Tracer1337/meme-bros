import { IsHash, IsOptional } from "class-validator"
import { PaginationDTO } from "src/pagination/pagination.dto"

export class GetAllTemplatesDTO extends PaginationDTO {
  @IsOptional()
  @IsHash("md5", { each: true })
  hashes?: string[]
}
