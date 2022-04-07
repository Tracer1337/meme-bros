import { Modules } from "@meme-bros/client-lib"
import { useRenderWorker } from "../../lib/workers"

export function useCoreModule(): Modules.CoreModule {
    const { isLoading, call: render } = useRenderWorker()

    return {
        render: isLoading ? undefined : render
    }
}
