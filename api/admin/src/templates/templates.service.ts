import { FilterQuery, Model } from "mongoose"
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Editor } from "@meme-bros/shared"
import { createHash } from "../lib/crypto"
import { assertIsValidObjectId } from "../lib/assert"
import { StorageService } from "../storage/storage.service"
import { Template, TemplateDocument } from "./schemas/template.schema"
import { CreateTemplateDTO } from "./dto/create-template.dto"
import { canvasValidator } from "./validators/canvas.validator"
import { UpdateTemplateDTO } from "./dto/update-template.dto"

@Injectable()
export class TemplatesService {
    constructor(
        @InjectModel(Template.name) private readonly templateModel: Model<TemplateDocument>,
        private readonly storageService: StorageService
    ) {}

    validateCanvas(canvas: Editor.Canvas) {
        const { error } = canvasValidator
            .label("canvas")
            .required()
            .validate(canvas)
        if (error) {
            const errors = error.details.map((error) => error.message)
            throw new BadRequestException(errors)
        }
    }

    async create(createTemplateDTO: CreateTemplateDTO): Promise<TemplateDocument> {
        await this.assertTemplateNotExists({ name: createTemplateDTO.name })
        const template = new this.templateModel(createTemplateDTO)
        template.previewFile = await this.createPreview(template)
        template.hash = this.getTemplateHash(template)
        return template.save()
    }

    async findAll(filter?: {
        hashes?: string[]
    }): Promise<TemplateDocument[]> {
        let query: FilterQuery<TemplateDocument> = {}
        if (filter?.hashes) {
            query.hash = {
                $in: filter.hashes
            }
        }
        return this.templateModel.find(query)
    }

    async getHashList() {
        const docs = await this.templateModel.aggregate<
            Pick<Template, "hash">
        >([
            {
                "$sort": {
                    "uses": -1, 
                    "name": 1
                }
            }, {
                "$project": {
                    "hash": true
                }
            }
        ])
        return docs.map((doc) => doc.hash)
    }

    async getHashListHash() {
        return createHash(await this.getHashList(), "md5")
    }

    async update(
        id: string,
        updateTemplateDTO: UpdateTemplateDTO
    ): Promise<TemplateDocument> {
        assertIsValidObjectId(id)
        await this.assertTemplateExists({ _id: id })
        const template = await this.templateModel.findByIdAndUpdate(
            id,
            updateTemplateDTO,
            { returnDocument: "after" }
        )
        if (updateTemplateDTO.canvas) {
            await this.deletePreview(template)
            template.previewFile = await this.createPreview(template)
        }
        template.hash = this.getTemplateHash(template)
        return await template.save()
    }

    async registerUse(id: string) {
        assertIsValidObjectId(id)
        await this.assertTemplateExists({ _id: id })
        await this.templateModel.updateOne({ _id: id }, {
            $inc: {
                uses: 1
            }
        })
    }

    async delete(id: string) {
        assertIsValidObjectId(id)
        await this.assertTemplateExists({ _id: id })
        const template = await this.templateModel.findById(id)
        await this.templateModel.deleteOne({ _id: id })
        await this.deletePreview(template)
    }

    async createPreview(template: TemplateDocument) {
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

    async deletePreview(template: TemplateDocument) {
        await this.storageService.delete(template.previewFile)
    }

    getTemplateHash(template: TemplateDocument) {
        const data = {
            name: template.name,
            canvas: template.canvas,
            previewFile: template.previewFile
        }
        return createHash(data, "md5")
    }

    async assertTemplateNotExists(query: FilterQuery<TemplateDocument>) {
        const exists = await this.templateModel.exists(query)
        if (exists) {
            throw new BadRequestException(`Template already exists`)
        }
    }

    async assertTemplateExists(query: FilterQuery<TemplateDocument>) {
        const exists = await this.templateModel.exists(query)
        if (!exists) {
            throw new NotFoundException()
        }
    }
}
