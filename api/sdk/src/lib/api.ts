import globalAxios from "axios"

export abstract class API {
    protected axios = globalAxios.create()
}
