// Data URI Syntax: data:[<media type>][;base64],<data>
import mime from "mime-types"

export function fetchAsDataURI(uri: string) {
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

export function getBase64FromDataURI(dataURI: string) {
    return dataURI.split(",")[1]
}

export function getMimeTypeFromDataURI(dataURI: string) {
    return dataURI.substring(
        dataURI.indexOf(":") + 1,
        dataURI.indexOf(";")
    )
}

export function getFileExtensionFromDataURI(dataURI: string) {
    return mime.extension(getMimeTypeFromDataURI(dataURI))
}

export function replaceMimeTypeInDataURI(dataURI: string, mimeType: string) {
    return dataURI.substring(0, dataURI.indexOf(":") + 1)
        + mimeType
        + dataURI.substring(dataURI.indexOf(";"))
}
