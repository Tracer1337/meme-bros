import { AxiosInstance } from "axios"
import { Profile, AccessToken, Config } from "../types"
import { Getter } from "../../lib/getter"
import { Resource } from "../../lib/resource"

export class AuthResource extends Resource<Config> {
    public profile: Getter<Profile>

    constructor(axios: AxiosInstance, config: Config) {
        super(axios, config)
        this.profile = new Getter(axios, () => "auth/profile")
    }

    async login(payload: {
        username: string,
        password: string
    }) {
        const res = await this.axios.post<AccessToken>("auth/login", payload)
        this.config.token = res.data.access_token
        return res.data
    }

    async changePassword(payload: {
        oldPassword: string,
        newPassword: string
    }) {
        await this.axios.put("auth/change-password", payload)
    }
}
