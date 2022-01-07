import { Model } from "mongoose"
import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Template, TemplateDocument } from "./schemas/template.schema"
import { CreateTemplateDTO } from "./dto/create-template.dto"

@Injectable()
export class TemplatesService {
    constructor(
        @InjectModel(Template.name) private templateModel: Model<TemplateDocument>
    ) {}

    async create(createTemplateDTO: CreateTemplateDTO): Promise<Template> {
        const template = new this.templateModel(createTemplateDTO)
        return template.save()
    }

    async findAll(): Promise<Template[]> {
        return this.templateModel.find().exec()
    }
}
