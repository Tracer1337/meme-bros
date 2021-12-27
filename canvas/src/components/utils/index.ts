export function makeId() {
    return Math.floor(Math.random() * 1e8)
}

export function clone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj))
}
