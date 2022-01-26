import { isValidObjectId } from "mongoose"
import { NotFoundException } from "@nestjs/common"

export function assertIsValidObjectId(id: string) {
    if (!isValidObjectId(id)) {
        throw new NotFoundException()
    }
}
