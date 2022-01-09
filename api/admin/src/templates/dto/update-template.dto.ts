import { PartialType } from "@nestjs/mapped-types"
import { CreateTemplateDTO } from "./create-template.dto"

export class UpdateTemplateDTO extends PartialType(CreateTemplateDTO) {}
