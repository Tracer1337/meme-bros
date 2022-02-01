import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import {
    StorageService,
    CoreService,
    TemplateDocument
} from "@meme-bros/api-lib"
import { Editor } from "@meme-bros/client-lib"

@Injectable()
export class PreviewsService {
    constructor(
        private readonly configService: ConfigService,
        private readonly storageService: StorageService,
        private readonly coreService: CoreService
    ) {}

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
    private getFileExtensionForCanvas(canvas: Editor.Canvas) {
        const animated = canvas.layers.some((layer) => {
            const element = canvas.elements[layer]
            return this.isImageElement(element) && element.data.animated  
        })
        if (animated) return "gif"
        return "png"
    }

    // TODO: same as above
    private isImageElement(element: Editor.CanvasElement): element is Editor.PickElement<"image"> {
        return element.type === "image"
    }

    private getPixelRatio(canvas: Editor.Canvas) {
        const width = this.configService.get<number>("templates.previewWidth")
        const height = this.configService.get<number>("templates.previewHeight")
        return canvas.width >= canvas.height
            ? width / canvas.width
            : height / canvas.height
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
