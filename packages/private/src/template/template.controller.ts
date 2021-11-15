import { Body, Controller, Post } from "@nestjs/common"
import { CreateTemplateDTO } from "./dto/create-template.dto"
import { TemplateService } from "./template.service"

@Controller("/template")
export class TemplateController {
    constructor(private readonly templateService: TemplateService) {}

    @Post()
    createTemplate(@Body() createTemplateDTO: CreateTemplateDTO) {
        console.log(createTemplateDTO)
        return "Hello World"
    }
}
