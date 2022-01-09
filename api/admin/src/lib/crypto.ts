import crypto from "crypto"

export function createHash(input: any, algorithm = "sha256") {
    const data = typeof input !== "string"
        ? JSON.stringify(input)
        : input
    return crypto
        .createHash(algorithm)
        .update(data, "utf8")
        .digest("hex")
}
