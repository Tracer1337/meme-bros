import { Inject, Injectable } from "@nestjs/common"
import { ConfigType } from "@nestjs/config"
import {
    Editor,
    getBase64FromDataURI,
    getFileExtensionForCanvas
} from "@meme-bros/shared"
import { StorageService } from "../storage/storage.service"
import { CoreService } from "../core/core.service"
import { TemplateDocument } from "../schemas/template.schema"
import { templatesConfig } from "../templates/templates.config"

@Injectable()
export class PreviewsService {
    constructor(
        @Inject(templatesConfig.KEY)
        private readonly config: ConfigType<typeof templatesConfig>,
        private readonly storageService: StorageService,
        private readonly coreService: CoreService
    ) {}

    async createPreview(template: TemplateDocument) {
        const buffer = await this.renderPreview(template.canvas)
        const ext = getFileExtensionForCanvas(template.canvas)
        return await this.storageService.put(buffer, ext)
    }

    async renderPreview(canvas: Editor.Canvas) {
        const dataURI = await this.coreService.render({
            ...canvas,
            debug: false,
            pixelRatio: this.getPixelRatio(canvas),
            elements: this.getPreviewElements(canvas)
        })
        const base64 = getBase64FromDataURI(dataURI)
        return Buffer.from(base64, "base64")
    }

    async deletePreview(template: TemplateDocument) {
        await this.storageService.delete(template.previewFile)
    }

    private getPixelRatio(canvas: Editor.Canvas) {
        return canvas.width >= canvas.height
            ? this.config.preview.width / canvas.width
            : this.config.preview.height / canvas.height
    }

    private getPreviewElements(canvas: Editor.Canvas) {
        return canvas.layers
            .map((layer) =>
                canvas.elements[layer].type !== "textbox"
                    ? canvas.elements[layer]
                    : null
            )
            .filter((element) => element !== null)
    }
}
