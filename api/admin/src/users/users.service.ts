import { Injectable, OnModuleInit } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { createHash } from "../lib/crypto"
import { User, UserDocument } from "./schemas/user.schema"

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) {}

    async onModuleInit() {
        await this.createInitialUser()
    }

    async createInitialUser() {
        if (!await this.userModel.exists({})) {
            await this.userModel.create({
                username: "Admin",
                password: createHash("admin")
            })
        }
    }
    
    async findOne(username: string): Promise<UserDocument | null> {
        return await this.userModel.findOne({
            username
        })
    }
}
