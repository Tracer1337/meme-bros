import { Model } from "mongoose"
import { ConflictException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Trend as TrendModel, TrendDocument } from "@meme-bros/api-lib"
import { Subject, Trend } from "./trend"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class AppService implements OnModuleInit {
    private subjects: Record<string, Subject> = {}

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
        const trend = await this.trendModel.findOneAndUpdate(
            { name: this.configService.get<string>("trend.name") },
            {},
            { new: true, upsert: true }
        )
        const scores: Map<Subject, number> = new Map()
        trend.scores.forEach((score, id) => {
            this.subjects[id] = new Subject(id)
            scores.set(this.subjects[id], score)
        })
        this.trend.loadScores(scores)
    }

    async save() {
        const scores: Record<string, number> = {}
        this.trend.scores.forEach((score, subject) => {
            scores[subject.id] = score
        })
        await this.trendModel.updateOne(
            { name: this.configService.get<string>("trend.name") },
            { $set: { scores } }
        )
    }
    
    async addSubject(id: string) {
        if (id in this.subjects) {
            throw new ConflictException()
        }
        this.subjects[id] = new Subject(id)
        this.trend.addSubject(this.subjects[id])
        await this.save()
    }

    async removeSubject(id: string) {
        if (!(id in this.subjects)) {
            throw new NotFoundException()
        }
        this.trend.removeSubject(this.subjects[id])
        delete this.subjects[id]
        await this.save()
    }

    async hit(id: string) {
        if (!(id in this.subjects)) {
            throw new NotFoundException()
        }
        this.trend.hit(this.subjects[id])
        await this.save()
    }

    getTrend() {
        return this.trend
            .getTrendingSubjects()
            .map((subject) => subject.id)
    }
}
