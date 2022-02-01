import { FilterQuery, Model } from "mongoose"
import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { ConfigService } from "@nestjs/config"
import type { Editor } from "@meme-bros/client-lib"
import {
    createHash,
    assertIsValidObjectId,
    StorageService,
    Template,
    TemplateDocument,
    TrendService,
    CoreService
} from "@meme-bros/api-lib"
import { CreateTemplateDTO } from "./dto/create-template.dto"
import { canvasValidator } from "./validators/canvas.validator"
import { UpdateTemplateDTO } from "./dto/update-template.dto"

@Injectable()
export class TemplatesService implements OnModuleInit {
    constructor(
        @InjectModel(Template.name) private readonly templateModel: Model<TemplateDocument>,
        private readonly configService: ConfigService,
        private readonly storageService: StorageService,
        private readonly trendService: TrendService,
        private readonly coreService: CoreService
    ) {}

    async onModuleInit() {
        await this.syncTrend()
    }

    async syncTrend() {
        const templates = await this.findAll()
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
        template.previewFile = await this.createPreview(template)
        template.hash = this.getTemplateHash(template)
        await template.save()
        await this.trendService.addSubject(template.id)
        return template
    }

    async findAll(): Promise<TemplateDocument[]> {
        return this.templateModel.find().select("-canvas")
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
        const template = await this.findById(id, { canvas: 1 })
        return template.canvas
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

    async delete(id: string) {
        assertIsValidObjectId(id)
        await this.assertTemplateExists({ _id: id })
        const template = await this.templateModel.findById(id)
        await this.templateModel.deleteOne({ _id: id })
        await this.deletePreview(template)
        await this.trendService.removeSubject(id)
    }

    async createPreview(template: TemplateDocument) {
        const buffer = await this.renderPreview(template.canvas)
        const ext = this.getFileExtensionForCanvas(template.canvas)
        return await this.storageService.put(buffer, ext)
    }

    async renderPreview(canvas: Editor.Canvas) {
        const dataURI = await this.coreService.render({
            ...canvas,
            debug: false,
            pixelRatio: this.getPixelRatio(canvas),
            elements: this.getPreviewElements(canvas)
        })
        const base64 = dataURI.split(",")[1]
        return Buffer.from(base64, "base64")
    }

    async deletePreview(template: TemplateDocument) {
        await this.storageService.delete(template.previewFile)
    }

    // TODO: Move to lib package (e.g. "canvas-utils")
    getFileExtensionForCanvas(canvas: Editor.Canvas) {
        const animated = canvas.layers.some((layer) => {
            const element = canvas.elements[layer]
            return this.isImageElement(element) && element.data.animated  
        })
        if (animated) return "gif"
        return "png"
    }

    // TODO: same as above
    isImageElement(element: Editor.CanvasElement): element is Editor.PickElement<"image"> {
        return element.type === "image"
    }

    getPixelRatio(canvas: Editor.Canvas) {
        const width = this.configService.get<number>("templates.previewWidth")
        const height = this.configService.get<number>("templates.previewHeight")
        return canvas.width >= canvas.height
            ? width / canvas.width
            : height / canvas.height
    }

    getPreviewElements(canvas: Editor.Canvas) {
        return canvas.layers
            .map((layer) =>
                canvas.elements[layer].type !== "textbox"
                    ? canvas.elements[layer]
                    : null
            )
            .filter((element) => element !== null)
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
