export function getImageDimensions(uri: string) {
    return new Promise<{
        width: number,
        height: number
    }>((resolve) => {
        const img = new Image()
        img.onload = () => {
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight
            })
        }
        img.src = uri
    })
}
