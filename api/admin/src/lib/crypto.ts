import crypto from "crypto"

export function createHash(input: any) {
    const data = typeof input !== "string"
        ? JSON.stringify(input)
        : input
    return crypto
        .createHash("md5")
        .update(data, "utf8")
        .digest("hex")
}
