import { useEffect, useState } from "react"

export function useDebouncedValue<T>(value: T, timeout: number) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const id = setTimeout(() => {
            setDebouncedValue(value)
        }, timeout)

        return () => {
            clearTimeout(id)
        }
    }, [value, timeout])

    return debouncedValue
}
