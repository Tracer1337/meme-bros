export const configuration = () => ({
    port: parseInt(process.env.PORT) || 7000,
    database: {
        uri: process.env.MONGODB_URI || "mongodb://localhost/meme-bros"
    },
    trend: {
        damping: 10,
        reduction: 100,
        name: "templates"
    }
})
