import { AnyConstructor, AnyFunction } from "tsdef"

declare global {
    interface Window {
        Go?: AnyConstructor,
        render?: AnyFunction
    }
}
