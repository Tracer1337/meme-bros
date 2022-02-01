import path from "path"

const REPOSITORY_ROOT_DIR = path.join(__dirname, "..", "..", "..", "..")

export const configuration = () => ({
    port: parseInt(process.env.PORT) || 5000,
    database: {
        uri: process.env.MONGODB_URI || "mongodb://localhost/meme-bros"
    },
    trend: {
        uri: process.env.TREND_URI || "http://localhost:7000"
    },
    core: {
        uri: process.env.CORE_URI || "http://localhost:8000"
    },
    storage: {
        path: process.env.STORAGE_PATH || path.join(REPOSITORY_ROOT_DIR, "storage")
    },
    jwt: {
        secret: process.env.JWT_SECRET || "secret"
    },
    templates: {
        previewWidth: 500,
        previewHeight: 500
    }
})
