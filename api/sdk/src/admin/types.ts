export type Config = {
    host: string,
    token: string
}

export type Profile = {
    id: string,
    username: string
}

export type AccessToken = {
    access_token: string
}

export type Template = {
    id: string,
    name: string,
    hash: string,
    uses: number,
    previewFile: string
}

export type CreateTemplate = {
    name: string,
    canvas: any
}

export type Sticker = {
    filename: string,
    uses: number
}

export type CreateSticker = {
    uri: string
}

export type Upload = {
    id: string,
    link: string
}
