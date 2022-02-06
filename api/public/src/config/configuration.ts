import path from "path"

const REPOSITORY_ROOT_DIR = path.join(__dirname, "..", "..", "..", "..")

export const configuration = () => ({
    port: parseInt(process.env.PORT) || 6006,
    database: {
        uri: process.env.MONGODB_URI || "mongodb://localhost/meme-bros"
    },
    storage: {
        path: process.env.STORAGE_PATH || path.join(REPOSITORY_ROOT_DIR, "storage")
    },
    throttle: {
        ttl: 60,
        limit: 10
    },
    templates: {
        trend: {
            name: "templates",
            damping: 10,
            reduction: 100
        }
    }
})
