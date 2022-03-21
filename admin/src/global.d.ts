import { AnyConstructor } from "tsdef"

declare global {
    interface Window {
        Go?: AnyConstructor
    }
}
