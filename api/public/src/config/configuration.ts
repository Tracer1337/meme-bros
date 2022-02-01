import path from "path"

const REPOSITORY_ROOT_DIR = path.join(__dirname, "..", "..", "..", "..")

export const configuration = () => ({
    port: parseInt(process.env.PORT) || 6000,
    database: {
        uri: process.env.MONGODB_URI || "mongodb://localhost/meme-bros"
    },
    trend: {
        uri: process.env.TREND_URI || "http://localhost:7000"
    },
    storage: {
        path: process.env.STORAGE_PATH || path.join(REPOSITORY_ROOT_DIR, "storage")
    },
    throttle: {
        ttl: 60,
        limit: 10
    }
})
