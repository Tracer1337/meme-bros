import { AxiosInstance } from "axios"
import { Config } from "./types"

export type Login = {
    username: string,
    password: string
}

export type ChangePassword = {
    oldPassword: string,
    newPassword: string
}

export type Profile = {
    id: string,
    username: string
}

export type AccessToken = {
    access_token: string
}

export class AuthResource {
    constructor(
        private readonly axios: AxiosInstance,
        private readonly config: Config
    ) {}

    public async login(payload: Login) {
        const res = await this.axios.post<AccessToken>("auth/login", payload)
        this.config.token = res.data.access_token
        return res.data
    }

    public async getProfile() {
        const res = await this.axios.get<Profile>("auth/profile")
        return res.data
    }

    public async changePassword(payload: ChangePassword) {
        await this.axios.put("auth/change-password", payload)
    }
}
