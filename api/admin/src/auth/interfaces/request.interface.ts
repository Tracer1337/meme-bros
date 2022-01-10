export interface AuthorizedRequest extends Request {
    user: {
        id: string,
        username: string
    }
}
