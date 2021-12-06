export function required(setValue: (value: any) => void) {
    return (value: any) => {
        if (value !== null && value !== undefined) {
            setValue(value)
        }
    }
}
