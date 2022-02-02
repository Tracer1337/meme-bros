import { API } from "@meme-bros/api-sdk"

const api = new API(
    process.env.API_HOST || "http://10.0.2.2:6000"
)

export default api

