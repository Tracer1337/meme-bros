import { FilterQuery, Model } from "mongoose"
import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import {
    createHash,
    assertIsValidObjectId,
    Template,
    TemplateDocument
} from "@meme-bros/api-lib"

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

    async getHotList() {
        return []
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
