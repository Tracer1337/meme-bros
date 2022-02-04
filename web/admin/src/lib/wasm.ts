import { useEffect, useState } from "react"

export function useWasm({ url }: {
    url: string
}) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!window.Go) {
            console.warn("window.Go is not defined")
            return
        }

        const go = new window.Go()
    
        let wasm

        setIsLoading(true)

        if ("instantiateStreaming" in WebAssembly) {
            WebAssembly
                .instantiateStreaming(fetch(url), go.importObject)
                .then((obj) => {
                    wasm = obj.instance
                    go.run(wasm)
                    setIsLoading(false)
                })
        } else {
            fetch(url)
                .then((resp) => resp.arrayBuffer())
                .then((bytes) => {
                    WebAssembly
                        .instantiate(bytes, go.importObject)
                        .then((obj) => {
                            wasm = obj.instance
                            go.run(wasm)
                            setIsLoading(false)
                        })
                })
        }
    }, [url])

    return { isLoading }
}
