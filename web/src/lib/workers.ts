import * as Core from "@meme-bros/core-types"
import { useEffect, useRef, useState } from "react"

export function useRenderWorker(): {
    isLoading: boolean,
    call: (canvas: Core.Canvas) => Promise<string>
} {
    const [isLoading, setIsLoading] = useState(true)

    const worker = useRef<Worker>()

    const call = (canvas: Core.Canvas) => {
        return new Promise<string>((resolve, reject) => {
            if (!worker.current) {
                return reject()
            }
            worker.current.addEventListener("message", ({ data }) => {
                if (data.type === "data") {
                    resolve(data.data)
                }
            })
            worker.current.postMessage(JSON.stringify(canvas))
        })
    }

    useEffect(() => {
        worker.current = new Worker("/workers/render.js")
        worker.current.addEventListener("message", ({ data }) => {
            if (data.type === "ready") {
                setIsLoading(false)
            }
        })
        return () => {
            worker.current?.terminate()
        }
    }, [])

    return {
        isLoading,
        call
    }
}
