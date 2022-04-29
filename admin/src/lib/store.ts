import React from "react"
import create from "zustand"
import createContext from "zustand/context"
import { API, useAPI } from "@meme-bros/api-sdk"
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

const { Provider, useStore } = createContext<Store>()

const createStore = ({ api }: { api: API }) =>
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
            api.auth.getProfile().then(({ username }) =>
                set({ isLoggedIn: true, username })
            )
        }
    }))

export function StoreProvider({ children }: { children: JSX.Element }) {
    const api = useAPI()
    
    return React.createElement(
        Provider,
        {
            createStore: () => createStore({ api }),
            children
        }
    )
}

export { useStore }
