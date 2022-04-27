import globalAxios from "axios"

export abstract class API<C> {
    protected axios = globalAxios.create()

    constructor(protected config: C) {
        this.init()
    }

    protected abstract init(): void

    public setConfig(config: C) {
        this.config = config
        this.init()
    }
}
