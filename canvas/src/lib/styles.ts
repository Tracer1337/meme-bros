export function getTextShadow(stroke: number, color: string) {
    if (stroke === 0) {
        return ""
    }

    const shadows = []

    for (let i = -stroke; i <= stroke; i++) {
        for (let j = -stroke; j <= stroke; j++) {
            shadows.push(`${i}px ${j}px 0 ${color}`)
        }
    }

    return shadows.join(",")
}
