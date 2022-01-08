import { Model } from "mongoose"
import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Template, TemplateDocument } from "./schemas/template.schema"
import { CreateTemplateDTO } from "./dto/create-template.dto"
import { Editor } from "@meme-bros/shared"
import { StorageService } from "src/storage/storage.service"

@Injectable()
export class TemplatesService {
    constructor(
        @InjectModel(Template.name) private readonly templateModel: Model<TemplateDocument>,
        private readonly storageService: StorageService
    ) {}

    async create(createTemplateDTO: CreateTemplateDTO): Promise<TemplateDocument> {
        const exists = await this.templateModel.exists({
            name: createTemplateDTO.name
        })
        if (exists) {
            throw new BadRequestException(`Template '${createTemplateDTO.name}' already exists`)
        }
        const template = new this.templateModel(createTemplateDTO)
        template.previewFile = await this.createPreview(template)
        return template.save()
    }

    async createPreview(template: TemplateDocument): Promise<string> {
        const elementId = template.canvas.layers.find((id) =>
            template.canvas.elements[id]?.type === "image"
        )
        if (elementId === undefined) {
            throw new BadRequestException("Image not found")
        }
        const element = template.canvas.elements[elementId] as Editor.PickElement<"image">
        const base64 = element.data.uri.split(",")[1]
        const buffer = Buffer.from(base64, "base64")
        return await this.storageService.put(buffer, "png")
    }

    async findAll(): Promise<TemplateDocument[]> {
        return this.templateModel.find().exec()
    }
}
