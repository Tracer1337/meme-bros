export function fetchBase64(uri: string) {
    return new Promise<string>(async (resolve, reject) => {
        const response = await fetch(uri)
        const blob = await response.blob()
        const fileReader = new FileReader()
        fileReader.onload = function() {
            if (typeof this.result !== "string") {
                return reject()
            }
            resolve(this.result)
        }
        fileReader.onerror = () => reject()
        fileReader.readAsDataURL(blob)
    })
}
