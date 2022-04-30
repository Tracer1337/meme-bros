import { Modules } from "@meme-bros/client-lib"

export function useViewModule(): Modules.ViewModule {
    const useDimensions: Modules.ViewModule["useDimensions"] = () => {
        const element = document.getElementById("app")
        const rect = element
            ? element.getBoundingClientRect()
            : { width: 0, height: 0 }
        return {
            width: rect.width,
            height: rect.height
        }
    }

    return {
        useDimensions
    }
}
