import create from "zustand"
import createContext from "zustand/context"
import { AdminAPI, useAdminAPI } from "@meme-bros/api-sdk/dist/admin"
import { Storage } from "./storage"
import React from "react"

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

const { Provider, useStore } = createContext<Store>()

const createStore = ({ api }: { api: AdminAPI }) =>
    create<Store>((set) => ({
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

export function StoreProvider({ children }: { children: JSX.Element }) {
    const api = useAdminAPI()
    
    return React.createElement(
        Provider,
        {
            createStore: () => createStore({ api }),
            children
        }
    )
}

export { useStore }
