import { Model } from "mongoose"
import { ConflictException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { ConfigService } from "@nestjs/config"
import { Trend as TrendModel, TrendDocument } from "@meme-bros/api-lib"
import { Trend } from "./trend"
import { SyncSubjectsDTO } from "./dto/sync-subjects.dto"

@Injectable()
export class AppService implements OnModuleInit {
    private trend: Trend
    
    constructor(
        @InjectModel(TrendModel.name) private readonly trendModel: Model<TrendDocument>,
        private readonly configService: ConfigService
    ) {
        this.trend = new Trend(
            this.configService.get<number>("trend.damping"),
            this.configService.get<number>("trend.reduction")
        )
    }

    async onModuleInit() {
        await this.load()
    }

    async load() {
        const trend = await this.trendModel.findOneAndUpdate(
            { name: this.configService.get<string>("trend.name") },
            {},
            { new: true, upsert: true }
        )
        this.trend.loadScores(Object.fromEntries(trend.scores))
    }

    async save() {
        await this.trendModel.updateOne(
            { name: this.configService.get<string>("trend.name") },
            { $set: { scores: this.trend.getScores() } }
        )
    }
    
    async addSubject(id: string) {
        if (this.trend.hasSubject(id)) {
            throw new ConflictException()
        }
        this.trend.addSubject(id)
        await this.save()
    }

    async removeSubject(id: string) {
        if (!this.trend.hasSubject(id)) {
            throw new NotFoundException()
        }
        this.trend.removeSubject(id)
        await this.save()
    }

    async syncSubjects(syncSubjectsDTO: SyncSubjectsDTO) {
        this.trend.syncSubjects(syncSubjectsDTO.ids)
        await this.save()
    }

    async hit(id: string) {
        if (!this.trend.hasSubject(id)) {
            throw new NotFoundException()
        }
        this.trend.hit(id)
        await this.save()
    }

    getTrend() {
        return this.trend.getTrendingSubjects()
    }
}
