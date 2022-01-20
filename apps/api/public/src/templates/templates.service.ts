import { FilterQuery, Model } from "mongoose"
import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import {
    createHash,
    assertIsValidObjectId,
    Template,
    TemplateDocument
} from "@meme-bros/api-shared"

@Injectable()
export class TemplatesService {
    constructor(
        @InjectModel(Template.name) private readonly templateModel: Model<TemplateDocument>
    ) {}

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

    async registerUse(id: string) {
        assertIsValidObjectId(id)
        await this.assertTemplateExists({ _id: id })
        await this.templateModel.updateOne({ _id: id }, {
            $inc: {
                uses: 1
            }
        })
    }

    async assertTemplateExists(query: FilterQuery<TemplateDocument>) {
        const exists = await this.templateModel.exists(query)
        if (!exists) {
            throw new NotFoundException()
        }
    }
}
