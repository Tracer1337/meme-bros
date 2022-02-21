import deepmergeLib from "deepmerge"
import { isPlainObject } from "is-plain-object"
import type { SyncConfig } from "./sync"

export function makeId() {
    return Math.floor(Math.random() * 1e8)
}

export function getDateString() {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, "0")
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const yyyy = today.getFullYear()
    return dd + mm + yyyy
}

export function join(...paths: string[]) {
    return paths.join("/")
}

export function clone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj))
}

export function deepmerge<T>(
    x: Partial<T>,
    y: Partial<T>,
    options?: deepmergeLib.Options
): T
export function deepmerge<T1, T2>(
    x: Partial<T1>,
    y: Partial<T2>,
    options?: deepmergeLib.Options
): T1 & T2 {
    return deepmergeLib(x, y, {
        isMergeableObject: isPlainObject,
        arrayMerge: (_dest, source) => source,
        ...options
    })
}

export function diffUnique<T>(a: T[], b: T[]) {
    const diff = {
        added: [] as T[],
        removed: [] as T[]
    }

    const setA = new Set(a)
    const setB = new Set(b)

    setA.forEach((value) => {
        if (!setB.has(value)) {
            diff.removed.push(value)
        }
    })

    setB.forEach((value) => {
        if (!setA.has(value)) {
            diff.added.push(value)
        }
    })

    return diff
}

export function createIdsMap(templates: Record<string, { hash: string }>) {
    return Object.fromEntries(
        Object.entries(templates).map(([id, meta]) => [meta.hash, id])
    )
}

export async function assertDirExists(
    { path, fs }: SyncConfig,
    dir: string
) {
    if (!await fs.exists(join(path, dir))) {
        await fs.mkdir(join(path, dir))
    }
}
