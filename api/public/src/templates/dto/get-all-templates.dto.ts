import { PaginationDTO } from "@meme-bros/api-lib"
import { IsHash, IsOptional } from "class-validator"

export class GetAllTemplatesDTO extends PaginationDTO {
  @IsOptional()
  @IsHash("md5", { each: true })
  hashes?: string[]
}
