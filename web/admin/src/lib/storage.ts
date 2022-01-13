export namespace Storage {
    export enum Keys {
        TOKEN = "token"
    }

    export function get(key: Keys) {
        return localStorage.getItem(key)
    }

    export function set(key: Keys, value: string) {
        localStorage.setItem(key, value)
    }

    export function remove(key: Keys) {
        localStorage.removeItem(key)
    }
}
