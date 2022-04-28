import { FilterQuery, Model } from "mongoose"
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Editor } from "@meme-bros/shared"
import { TrendService } from "../trend/trend.service"
import { PreviewsService } from "../previews/previews.service"
import { Template, TemplateDocument } from "./template.schema"
import { CreateTemplateDTO } from "./dto/create-template.dto"
import { UpdateTemplateDTO } from "./dto/update-template.dto"
import { GetAllTemplatesDTO } from "./dto/get-all-templates.dto"
import { canvasValidator } from "./validators/canvas.validator"
import { createHash } from "../lib/crypto"
import { assertIsValidObjectId } from "../lib/assert"

@Injectable()
export class TemplatesService {
    constructor(
        @InjectModel(Template.name) private readonly templateModel: Model<TemplateDocument>,
        private readonly previewsService: PreviewsService,
        private readonly trendService: TrendService
    ) {}

    async onModuleInit() {
        await this.syncTrend()
    }

    async syncTrend() {
        const templates = await this.templateModel.find().select("-canvas")
        await this.trendService.syncSubjects(
            templates.map((template) => template.id)
        )
    }

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
        template.previewFile = await this.previewsService.createPreview(template)
        template.hash = this.getTemplateHash(template)
        await template.save()
        await this.trendService.addSubject(template.id)
        return template
    }

    async findAll(getAllTemplatesDTO: GetAllTemplatesDTO): Promise<TemplateDocument[]> {
        const query: FilterQuery<TemplateDocument> = {}
        if (getAllTemplatesDTO?.hashes) {
            query.hash = {
                $in: getAllTemplatesDTO.hashes
            }
        }
        return this.templateModel.find(query)
            .select("-canvas")
            .sort({ uses: "descending" })
            .limit(getAllTemplatesDTO.per_page)
            .skip(getAllTemplatesDTO.page * getAllTemplatesDTO.per_page)
    }

    async findById(id: string, projection: any = {
        canvas: 0
    }): Promise<TemplateDocument> {
        assertIsValidObjectId(id)
        const template = await this.templateModel.findById(id, projection)
        if (!template) {
            throw new NotFoundException()
        }
        return template
    }

    async findCanvasById(id: string) {
        assertIsValidObjectId(id)
        const template = await this.templateModel.findById(id)
        if (!template) {
            throw new NotFoundException()
        }
        return template.canvas
    }

    async getHash() {
        const lists = await Promise.all([
            this.getHashList(),
            this.getNewList(),
            this.getTopList(),
            this.getHotList()
        ])
        return createHash(lists, "md5")
    }

    async getHashList() {
        const docs = await this.templateModel.aggregate<
            Pick<Template, "hash">
        >([
            {
                "$sort": {
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

    async getNewList(): Promise<string[]> {
        const docs = await this.templateModel.aggregate<
            Pick<TemplateDocument, "_id">
        >([
            {
                "$sort": {
                    "_id": -1
                }
            }, {
                "$project": {
                    "_id": 1
                }
            }
        ])
        return docs.map((doc) => doc._id.toString())
    }

    async getTopList(): Promise<string[]> {
        const docs = await this.templateModel.aggregate<
            Pick<TemplateDocument, "_id">
        >([
            {
                "$sort": {
                    "uses": -1
                }
            }, {
                "$project": {
                    "_id": 1
                }
            }
        ])
        return docs.map((doc) => doc._id.toString())
    }

    async getHotList(): Promise<string[]> {
        return await this.trendService.getTrend()
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
            await this.previewsService.deletePreview(template)
            template.previewFile = await this.previewsService.createPreview(template)
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
        await this.trendService.hit(id)
    }

    async delete(id: string) {
        assertIsValidObjectId(id)
        await this.assertTemplateExists({ _id: id })
        const template = await this.templateModel.findById(id)
        await this.templateModel.deleteOne({ _id: id })
        await this.previewsService.deletePreview(template)
        await this.trendService.removeSubject(id)
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
