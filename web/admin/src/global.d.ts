import { AnyConstructor } from "tsdef"
import * as Core from "@meme-bros/core-types"

declare global {
    interface Window {
        Go?: AnyConstructor,
        render?: Core.Web.Render
    }
}
