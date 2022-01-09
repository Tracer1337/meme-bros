import path from "path"

export const configuration = () => ({
    port: parseInt(process.env.PORT) || 5000,
    database: {
        uri: process.env.MONGODB_URI || "mongodb://localhost/meme-bros"
    },
    storage: {
        path: process.env.STORAGE_PATH || path.join(__dirname, "..", "..", "storage")
    },
    jwt: {
        secret: process.env.JWT_SECRET || "secret"
    }
})
