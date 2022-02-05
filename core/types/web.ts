import { Modules } from "./modules"

export namespace Web {
    export type Render = (json: string, modules: Modules) => Promise<string>
}
