import { Model } from "mongoose"
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { InjectModel } from "@nestjs/mongoose"
import { Trend as TrendModel, TrendDocument } from "../schemas/trend.schema"
import { Trend } from "./trend"

@Injectable()
export class TrendService {
    constructor(
        @InjectModel(TrendModel.name) private readonly trendModel: Model<TrendDocument>,
        private readonly configService: ConfigService
    ) {}

    async load() {
        const trendModel = await this.trendModel.findOneAndUpdate(
            { name: this.configService.get<string>("templates.trend.name") },
            {},
            { new: true, upsert: true }
        )
        const trend = new Trend(
            this.configService.get<number>("templates.trend.damping"),
            this.configService.get<number>("templates.trend.reduction")
        )
        trend.loadScores(Object.fromEntries(trendModel.scores))
        return trend
    }

    async save(trend: Trend) {
        await this.trendModel.updateOne(
            { name: this.configService.get<string>("templates.trend.name") },
            { $set: { scores: trend.getScores() } }
        )
    }
    
    async addSubject(id: string) {
        const trend = await this.load()
        if (trend.hasSubject(id)) {
            throw new ConflictException()
        }
        trend.addSubject(id)
        await this.save(trend)
    }

    async removeSubject(id: string) {
        const trend = await this.load()
        if (!trend.hasSubject(id)) {
            throw new NotFoundException()
        }
        trend.removeSubject(id)
        await this.save(trend)
    }

    async syncSubjects(ids: string[]) {
        const trend = await this.load()
        trend.syncSubjects(ids)
        await this.save(trend)
    }

    async hit(id: string) {
        const trend = await this.load()
        if (!trend.hasSubject(id)) {
            throw new NotFoundException()
        }
        trend.hit(id)
        await this.save(trend)
    }

    async getTrend() {
        const trend = await this.load()
        return trend.getTrendingSubjects()
    }
}
