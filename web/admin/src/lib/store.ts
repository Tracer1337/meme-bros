import create from "zustand"
import { api } from "@meme-bros/api-sdk/dist/admin"
import { Storage } from "./storage"

type Store = {
    isLoggedIn: boolean,
    username: string,
    login: (args: {
        username: string,
        password: string
    }) => Promise<void>,
    logout: () => void,
    authorize: () => Promise<void>
}

export const useStore = create<Store>((set) => ({
    isLoggedIn: false,
    username: "",
    login: async (args) => {
        const { access_token } = await api.auth.login(args)
        Storage.set(Storage.Keys.TOKEN, access_token)
        set({
            isLoggedIn: true,
            username: args.username
        })
    },
    logout: () => {
        Storage.remove(Storage.Keys.TOKEN)
        set({
            isLoggedIn: false,
            username: ""
        })
    },
    authorize: async () => {
        api.auth.profile.get().then(({ username }) =>
            set({ isLoggedIn: true, username })
        )
    }
}))
