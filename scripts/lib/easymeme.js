import globalAxios from "axios"

class EasyMemeAPI {
    constructor() {
        this.axios = globalAxios.create({
            baseURL: "https://www.easymeme69.com/"
        })
    }

    async getTemplates() {
        const res = await this.axios.get("api/templates")
        return res.data
    }

    async getImage(template) {
        return this.axios.get(template.image_url, {
            responseType: "arraybuffer"
        })
    }
}

export default EasyMemeAPI
