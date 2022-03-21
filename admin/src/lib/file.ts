export function importFile(mimeType: string) {
    return new Promise<File | undefined>((resolve) => {
        const input = document.createElement("input")
        input.onchange = (event: Event) => {
            const file = (event.target as HTMLInputElement)?.files?.[0]
            resolve(file)
        }
        input.type = "file"
        input.accept = mimeType
        document.body.appendChild(input)
        input.click()
        input.remove()
    })
}

export function downloadFile(src: string, filename: string) {
    const a = document.createElement("a")
    a.href = src
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

export function importImage(): Promise<{
    base64: string,
    width: number,
    height: number
} | undefined> {
    return new Promise(async (resolve) => {
        const file = await importFile("image/*")
        if (!file) {
            return
        }
        const url = URL.createObjectURL(file)
        const dim = await getImageDimensions(url)
        URL.revokeObjectURL(url)
        const reader = new FileReader()
        reader.onload = () => resolve(!reader.result ? undefined : {
            base64: reader.result as string,
            width: dim.width,
            height: dim.height
        })
        reader.readAsDataURL(file)
    })
}

export function getImageDimensions(uri: string): Promise<{
    width: number,
    height: number
}> {
    return new Promise((resolve) => {
        const image = new Image()
        image.onload = () => {
            resolve({
                width: image.naturalWidth,
                height: image.naturalHeight
            })
        }
        image.src = uri
    })
}
