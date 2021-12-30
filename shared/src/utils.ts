import deepmergeLib from "deepmerge"
import { isPlainObject } from "is-plain-object"

export function makeId() {
    return Math.floor(Math.random() * 1e8)
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
