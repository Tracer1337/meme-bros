import create from "zustand"
import { API } from "./api"
import { Storage } from "./storage"

type Store = {
    isLoggedIn: boolean,
    username: string,
    login: (args: {
        username: string,
        password: string
    }) => Promise<void>,
    authorize: () => Promise<void>
}

export const useStore = create<Store>((set) => ({
    isLoggedIn: false,
    username: "",
    login: async (args) => {
        const { access_token } = await API.login(args)
        Storage.set(Storage.Keys.TOKEN, access_token)
        set({
            isLoggedIn: true,
            username: args.username
        })
    },
    authorize: async () => {
        if (!Storage.get(Storage.Keys.TOKEN)) {
            return
        }
        API.getProfile().then(({ username }) =>
            set({ isLoggedIn: true, username })
        )
    }
}))
